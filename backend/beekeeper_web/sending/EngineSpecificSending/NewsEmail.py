from typing import Any

from django.db.models import QuerySet
from django.template.loader import render_to_string

from global_modules.email.EmailDjangoRender import EmailDjangoRender
from news.models import News


class NewsEmail(EmailDjangoRender):

    def text_in_render_django_file(self, context: dict):
        base_context = {
            'news_list': News.objects.all(),
            'frontend_url': 'https://gagtain.ru/'
        }
        context: dict[str | Any, QuerySet[News] | Any] = base_context | context
        self.text = render_to_string(template_name='News_Sending.html', context=context)
