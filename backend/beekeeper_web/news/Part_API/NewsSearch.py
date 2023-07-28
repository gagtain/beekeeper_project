from django.db.models import Count

from beekeeper_web_api.Part_API.custom_mixins import Filter
from delivery.serializers import CountSerializer
from news.models import News


class NewsFilterCount(Filter):
    models = News
    serializers_retrieve = CountSerializer

    filter_options = {}

    def search__count(self, *args, **kwargs):
        return super().search(*args, **kwargs)

    def init_queryset(self, queryset):
        return queryset.aggregate(count=Count('*'))