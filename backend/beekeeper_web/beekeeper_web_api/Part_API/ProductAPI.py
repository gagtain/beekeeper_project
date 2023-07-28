from django.db.models import QuerySet, Prefetch, Avg
from rest_framework.views import APIView

from ..models import Product, Category
from .custom_mixins import Filter, FilterFieldsCustom
from ..serializers import RetrieveClearAllOptionalProduct, RetrieveProductRemoveToProdachen


class ProductFilterName(APIView, FilterFieldsCustom):
    models = Product
    filter_options = {
        'name': 'name__icontains',
        'price': 'price__icontains',
    }
    type_obj = 'model'
    serializers_retrieve = RetrieveClearAllOptionalProduct

    def search__name(self, request):
        return super().search(request)

    def init_queryset(self, queryset: QuerySet):
        if not ('__all__' in self.fields):
            queryset = queryset.values(*self.fields)
        return queryset


class ProductFilter(APIView, Filter):
    models = Product
    filter_options = {
        'name': 'name__icontains',
        'price': 'price__icontains',
    }
    type_obj = 'model'
    serializers_retrieve = RetrieveProductRemoveToProdachen

    def search__default(self, request):
        return super().search(request)

    def init_queryset(self, queryset: QuerySet):
        queryset = queryset.order_by('count_purchase').prefetch_related(
            Prefetch('category', queryset=Category.objects.all().only('name')),
            'ImageProductList',
        ).annotate(Avg('rating_product__rating'))
        return queryset
