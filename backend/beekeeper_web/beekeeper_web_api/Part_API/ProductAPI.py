from django.db.models import QuerySet
from rest_framework.views import APIView

from online_store.models import Product
from .custom_mixins import Filter
from ..serializers import RetrieveClearAllOptionalProduct


class ProductFilterName(APIView, Filter):
    models = Product
    filter_options = {
        'name': 'name__icontains',
        'price': 'price__icontains',
    }
    serializers_retrieve = RetrieveClearAllOptionalProduct

    def init_queryset(self, queryset: QuerySet):
        if not ('__all__' in self.fields):
            queryset = queryset.values(*self.fields)
        return queryset