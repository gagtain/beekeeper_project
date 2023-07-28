from django.shortcuts import render
from rest_framework import viewsets

from news.Part_API.NewsAPI import NewsCreateAPI, NewsListAPI, NewsRetrieveAPI
from news.Part_API.NewsSearch import NewsFilterCount


# Create your views here.


class NewsAPI(viewsets.ViewSet, NewsCreateAPI,
              NewsListAPI, NewsRetrieveAPI,
              NewsFilterCount):
    pass