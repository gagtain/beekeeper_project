from django.shortcuts import render
from rest_framework import viewsets
# Create your views here.

class TelegramAPI(viewsets.ModelViewSet):
    """
    Установить/отменить двух-факторную аутентификацию
    Включить/выключить уведомления
    """
    ...