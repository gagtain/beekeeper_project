from beekeeper_web_api.models import Product, ProductItem


def get_product_websocket_key(product: Product):
    yield "product_all"
    yield f"product_{product.id}"


def get_product_item_websocket_key(product_item: ProductItem):
    yield "product_item_all"
    yield f"product_{product_item.product_id}_product_item"
    user_list_basket = product_item.basket_item_list.only('user_id').all()
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
