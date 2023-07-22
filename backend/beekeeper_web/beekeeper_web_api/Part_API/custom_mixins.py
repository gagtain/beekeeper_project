import json
from pyexpat import model

from django.core.exceptions import FieldError
from rest_framework import status
from rest_framework.exceptions import ParseError
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView


class Filter:
    """Класс для поиска объектов по определенным полям"""
    fields_params = 'fields'
    fields: str = []
    type_obj = ''

    def init_queryset(self, queryset):
        """Функция для промежуточных действий с обьектом, например сортировки, выбор полей и т.д"""
        return queryset

    def search(self, request):
        filters = self.filter_req(request.GET)
        try:
            q = self.init_queryset(self.models.objects.filter(**filters))
            if self.type_obj == 'model':
                ser = self.serializers_retrieve(q, many=True)
                data = ser.data
            else:
                ser = self.serializers_retrieve(data=q, many=True)
                data = ser.initial_data
            return Response(data, status=status.HTTP_200_OK)
        except FieldError as e:
            print(e)
            return Response(data={'errors': 'передано неверное имя поля'}, status=status.HTTP_400_BAD_REQUEST)

    def filter_req(self, req):
        filters = {}
        for key, value in req.items():
            if key in list(self.filter_options):
                filters[self.filter_options[key]] = req[key]
            else:
                filters[key] = value
        return filters


class FilterFieldsCustom(Filter):
    def search(self, request):
        filters = self.filter_req(request.GET)
        self.fields = request.GET.get('fields', list(self.filter_options.keys()))
        if type(self.fields) != list:
            del filters['fields']
            self.fields = json.loads(self.fields)
        try:
            q = self.init_queryset(self.models.objects.filter(**filters))
            ser = self.serializers_retrieve(q, many=True, context={'fields': self.fields})
            return Response(ser.data, status=status.HTTP_200_OK)
        except FieldError:
            return Response(data={'errors': 'передано неверное имя поля'}, status=status.HTTP_400_BAD_REQUEST)
