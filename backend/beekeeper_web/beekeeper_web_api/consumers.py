from django.db.models import Avg
from djangochannelsrestframework.decorators import action
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.observer import model_observer
from djangochannelsrestframework.observer.generics import ObserverModelInstanceMixin

from beekeeper_web_api.services.optimize_orm import optimize_product_item_list, optimize_product_item
from notify.services.fixed import FixedRussianData
from beekeeper_web_api.models import ProductItem, Product
from orders.serializers import ProductItemSerializer
from beekeeper_web_api.serializers import RetrieveProduct
from beekeeper_web_api.services.product_websocket import get_product_websocket_key, \
    get_product_subscribe_websocket_key, get_product_item_websocket_key, \
    get_product_item_subscribe_websocket_key_type, get_product_item_subscribe_websocket_key
from user.services.optimize_orm import optimize_ImageProductList, optimize_category, default_productItem_only, \
    default_productItem_select_related


class ProductConsumers(FixedRussianData, ObserverModelInstanceMixin, GenericAsyncAPIConsumer):
    """ Подписка на изменение продукта и его вариантов """

    """ Product """
    @action()
    async def subscribe_to_product(self, **kwargs):
        product_id = kwargs.get('product_id')
        await self.product_activity.subscribe(product_id=product_id)

    @model_observer(Product)
    async def product_activity(self, product, *args, **kwargs):
        await self.send_json(product)

    @product_activity.groups_for_signal
    def product_activity(self, instance: Product, *args, **kwargs):
        return get_product_websocket_key(product=instance)

    @product_activity.groups_for_consumer
    def product_activity(self, product_id=None, *args, **kwargs):
        return get_product_subscribe_websocket_key(product_id=product_id)

    @product_activity.serializer
    def product_activity(self, instance: Product, action, **kwargs):
        product = Product.objects.prefetch_related(
            optimize_category(),
            optimize_ImageProductList(), optimize_product_item_list('productItemList')
        ).annotate(Avg('rating_product__rating')).get(pk=instance.pk)

        serializer = RetrieveProduct(product)

        return dict(
            data=serializer.data,
            action=action.value,
            pk=product.pk,
            type='product'
        )

    """ ProductItem """
    @action()
    async def subscribe_to_product_item(self, **kwargs):
        if kwargs.get('product_id'):
            await self.product_item_activity.subscribe(product_id=kwargs['product_id'])
        elif kwargs.get('type'):
            await self.product_item_activity.subscribe(type_=kwargs['type'], user_id=self.scope['user'].id)


    @model_observer(ProductItem)
    async def product_item_activity(self, ProductItem, *args, **kwargs):
        await self.send_json(ProductItem)

    @product_item_activity.groups_for_signal
    def product_item_activity(self, instance: ProductItem, *args, **kwargs):
        return get_product_item_websocket_key(product_item=instance)

    @product_item_activity.groups_for_consumer
    def product_item_activity(self, product_id=None, type_=None, user_id=None, *args, **kwargs):
        if product_id is not None:
            return get_product_item_subscribe_websocket_key(product_id=product_id)
        elif type_ is not None:
            return get_product_item_subscribe_websocket_key_type(type_=type_,
                                                            user_id=user_id)

    @product_item_activity.serializer
    def product_item_activity(self, instance: ProductItem, action, **kwargs):
        product = ProductItem.objects.only(*default_productItem_only(),
                                           'product__productItemList')\
            .select_related(*default_productItem_select_related()) \
            .prefetch_related(optimize_category('product'),
                              optimize_ImageProductList('product'))\
            .get(pk=instance.pk)
        serializer = ProductItemSerializer(product)
        return dict(
            data=serializer.data,
            action=action.value,
            pk=product.pk,
            type='product_item'

        )


