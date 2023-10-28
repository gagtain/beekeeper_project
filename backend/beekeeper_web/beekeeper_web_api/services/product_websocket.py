from beekeeper_web_api.models import BasketItem, Product, ProductItem


def get_product_websocket_key(product: Product, **kwargs):
    yield "product_all"
    yield f"product_{product.id}"


def get_product_item_websocket_key(product_item: ProductItem, **kwargs):
    yield "product_item_all"
    yield f"product_{product_item.product_id}_product_item"
    if not kwargs.get('type', None) == 'receiver':
        
        user_list_basket = BasketItem.objects.only('user_id', 'id', 'productItem_id').filter(productItem_id=product_item.id)
        for user_basket in user_list_basket:
            yield f'user__{user_basket.user_id}__basket'


def get_product_item_subscribe_websocket_key_type(user_id, type_):
    if type_ == 'basket':
        yield f'user__{user_id}__basket'
    elif type_ == 'all':
        yield 'product__all'


def get_product_item_subscribe_websocket_key(product_id=None):
    yield f"product_{product_id}_product_item"


def get_product_subscribe_websocket_key(product_id=None):
    if product_id is not None:

        yield f"product_{product_id}"
    else:
        yield f"product_all"
