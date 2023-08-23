from django.db.models import QuerySet, Prefetch, Avg, Min, Count
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from rest_framework.views import APIView

from global_modules.exception.base import CodeDataException
from user.services.optimize_orm import optimize_ImageProductList, optimize_category
from ..models import Product, Category, ProductItem
from .custom_mixins import Filter
from ..serializers import RetrieveProductName, RetrieveProduct
from ..services.User import ProductServises
from ..services.optimize_orm import optimize_product_item_list


class ProductFilterName(APIView, Filter):
    models = Product
    filter_options = {
        'name': 'name__icontains',
    }
    type_obj = 'model'
    serializers_retrieve = RetrieveProductName

    @swagger_auto_schema(tags=['online_store'])
    def search(self, request):
        return super().search(request)

    def init_queryset(self, queryset: QuerySet):
        return queryset.only('id', 'name')


class ProductFilter(APIView, Filter):
    models = Product
    filter_options = {
        'name': 'name__icontains',
        'price': 'price__icontains',
    }
    type_obj = 'model'
    serializers_retrieve = RetrieveProduct
    order_by = ['count_purchase']
    skip_params = ['order_by', 'from', 'size']

    @swagger_auto_schema(tags=['online_store'])
    def search__default(self, request):
        if request.GET.get('order_by'):
            self.order_by = request.GET['order_by'].split(' ')

        return super().search(request)

    def init_order_by(self, queryset):
        if 'price_min' in self.order_by:
            self.order_by.remove('price_min')
            queryset = queryset.annotate(cnt=Min('productItemList__price')).order_by('cnt')
        else:
            print(self.order_by)
            queryset = queryset.order_by(*self.order_by)
        return queryset

    def init_queryset_add_params(self):
        ...

    def init_queryset(self, queryset: QuerySet):
        size = int(self.request.GET.get('size', 10))
        from_ = int(self.request.GET.get('from', 0))
        queryset = self.init_order_by(queryset)
        queryset = queryset.prefetch_related(
            optimize_category(),
            optimize_ImageProductList(), optimize_product_item_list('productItemList')
        ).annotate(Avg('rating_product__rating'))[from_:size + from_]
        return queryset


class GetProduct:

    @swagger_auto_schema(tags=['online_store'])
    def get_product(self, request, id):
        try:
            product = ProductServises.getProduct(id)
        except CodeDataException as e:
            return Response(status=e.status, data=e.error_data)
        return Response(RetrieveProduct(product).data)


class GetProductList:

    @swagger_auto_schema(tags=['online_store'])
    def get_product_list(self, request):
        size = request.GET.get('size', 10)
        product_list = ProductServises.getProductList(size)
        return Response(RetrieveProduct(product_list, many=True).data)
