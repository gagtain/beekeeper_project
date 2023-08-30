from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm

from beekeeper_web_api.models import BasketItem
from user.models import MainUser


# Register your models here.


class BasketItemInline(admin.TabularInline):
    model = BasketItem
    extra = 1

class Admin(admin.ModelAdmin):
    inlines = (BasketItemInline,)

admin.site.register(MainUser, Admin)