from django.conf import settings
from rest_framework import serializers

from news.models import News


class NewsSerializersCreate(serializers.ModelSerializer):
    main_image = serializers.CharField(default='news/default.png')

    class Meta:
        model = News
        fields = '__all__'

class NewsSerializersRetrieve(serializers.ModelSerializer):

    class Meta:
        model = News
        fields = '__all__'