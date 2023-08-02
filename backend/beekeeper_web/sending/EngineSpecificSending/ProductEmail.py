from django.db.models import Min
from django.template.loader import render_to_string

from beekeeper_web_api.models import Product
from global_modules.email.core.basic import Email


class ProductEmail(Email):

    def get_new_product(self):
        """Необходимо получить продукты, добавленный сегодня"""
        product_list = Product.objects.all().annotate(price_min=Min('productItemList__price'))
        return product_list

    def text_in_render_django_file(self, context):
        base_context = {
            'productList': self.get_new_product()
        }
        context = base_context | context
        self.text = render_to_string(template_name='Specific_Sending.html', context=context)