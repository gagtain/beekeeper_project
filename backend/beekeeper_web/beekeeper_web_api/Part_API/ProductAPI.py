from django.db.models import QuerySet, Prefetch, Avg, Min, Count
from rest_framework.views import APIView

from ..models import Product, Category, ProductItem
from .custom_mixins import Filter
from ..serializers import RetrieveProductName, RetrieveProductRemoveToProdachen


class ProductFilterName(APIView, Filter):
    models = Product
    filter_options = {
        'name': 'name__icontains',
    }
    type_obj = 'model'
    serializers_retrieve = RetrieveProductName

    def search__name(self, request):
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
    serializers_retrieve = RetrieveProductRemoveToProdachen
    order_by = ['count_purchase']
    skip_params = ['order_by']


    def search__default(self, request):
        if request.GET.get('order_by'):
            self.order_by = request.GET['order_by'].split(' ')


        return super().search(request)

    def init_order_by(self, queryset):
        if 'price_min' in self.order_by:
            self.order_by.remove('price_min')
            queryset = queryset.annotate(cnt=Min('productItemList__price')).order_by('cnt')
        else:
            queryset = queryset.order_by(*self.order_by)
        return queryset

    def init_queryset_add_params(self):
        ...

    def init_queryset(self, queryset: QuerySet):
        queryset = self.init_order_by(queryset)
        queryset = queryset.prefetch_related(
            Prefetch('category', queryset=Category.objects.all().only('name')),
            'ImageProductList',
            Prefetch('productItemList', queryset=ProductItem.objects.all().prefetch_related(
                'weight', 'dimensions'
            )),
        ).annotate(Avg('rating_product__rating'))
        return queryset
