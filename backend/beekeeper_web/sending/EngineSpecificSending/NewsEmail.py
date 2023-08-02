from django.template.loader import render_to_string

from global_modules.email.core.basic import Email


class NewsEmail(Email):

    def text_in_render_django_file(self, context):
        self.text = render_to_string(template_name='Specific_Sending.html', context=context)