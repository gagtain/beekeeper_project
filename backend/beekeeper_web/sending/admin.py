from django.contrib import admin

from sending.models import SpecificSending, EmailSending

# Register your models here.

admin.site.register(SpecificSending)
admin.site.register(EmailSending)