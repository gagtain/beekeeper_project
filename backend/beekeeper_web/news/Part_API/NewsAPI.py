import base64
import os
from urllib.parse import urlparse
from django.conf import settings
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from news.Services.NewsCreateInHTML import NewsCreateInHTML
from news.models import News
from news.serializers import NewsSerializersCreate, NewsSerializersRetrieve


class NewsCreateAPI(APIView):

    def news_create(self, request):
        context = request.data['context']
        new_data = request.data.copy()
        new_data['context'] = ''
        pre_serializer = NewsSerializersCreate(data=new_data)
        pre_serializer.is_valid(raise_exception=True)
        newsCreate = NewsCreateInHTML(html=context, dirs=pre_serializer.data['title'])
        new_data['context'] = newsCreate.genereteNews()
        if not new_data.get('main_image'):
            new_data['main_image'] = newsCreate.main_image
        serializer = NewsSerializersCreate(data=new_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class NewsListAPI(APIView):

    def news_list(self, request):
        size = int(self.request.GET.get('size', 10))
        from_ = int(self.request.GET.get('from', 0))
        instance = News.objects.all()[from_:from_+size]
        serializer = NewsSerializersRetrieve(instance=instance, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class NewsRetrieveAPI(APIView):

    def retrieve(self, request, pk):
        instance = get_object_or_404(News, pk=pk)
        serializer = NewsSerializersRetrieve(instance=instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
