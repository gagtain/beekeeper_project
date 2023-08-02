from django.conf import settings
from django.template.loader import render_to_string
from global_modules.email.core.basic import Email


class EmailSpecificSending(Email):

    def text_in_render_django_file(self, context):
        self.text = render_to_string(template_name='order.html', context=context)