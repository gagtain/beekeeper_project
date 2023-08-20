import json
from pyexpat import model
from django.db.models import Model
from django.core.exceptions import FieldError
from rest_framework import status, serializers
from rest_framework.response import Response


class Filter:
    """Класс для поиска объектов по определенным полям"""
    fields_params = 'fields'
    fields: str = []
    type_obj = ''
    skip_params = []
    request = {}
    serializers_retrieve: serializers.ModelSerializer.__class__
    models: Model

    def init_queryset(self, queryset):
        """Функция для промежуточных действий с обьектом, например сортировки, выбор полей и т.д"""
        return queryset

    def search(self, request):
        self.request = request
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
            elif key not in self.skip_params:
                filters[key] = value
        return filters


