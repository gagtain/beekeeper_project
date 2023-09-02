from beekeeper_web_api.models import Product


def get_product_websocket_key(product: Product):
    yield "product_all"
    yield f"product_{product.id}"


def get_product_subscribe_websocket_key(product_id=None):
    if product_id is None:
        yield "product_all"
    else:
        yield f"product_{product_id}"