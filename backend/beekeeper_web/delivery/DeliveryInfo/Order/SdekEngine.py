from delivery.DeliveryInfo.Order.Abstract.AbstractOrderSdekEngine import AbstractOrderSdekEngine
from delivery.DeliveryInfo.Order.enum.Pred_Payment import PrePayment
from delivery.dilivery_core.shemas.Delivery import Packages, PackagesItems, Payment
from orders.models import Order, OrderItem


def get_weight_product(order_item: OrderItem) -> int:
    return int(order_item.productItem.weight.weight)


class SdekOnlineStoreEngine(AbstractOrderSdekEngine):
    """Класс для получения информации о заказе интернет магазина для системы доставок СДЭК"""
    _order: Order

    def __init__(self, order_id, *args, **kwargs):
        super().__init__(*args, order=Order.objects.get(id=order_id), **kwargs)

    def get_packages(self) -> list[Packages]:
        packages: list[Packages] = [Packages(
            height=0,
            length=0,
            weight=0,
            width=0,
            number=f"Упаковка №1"
        )]
        for package in packages:
            """Необходимо указать механизм распределения товаров по разным упаковкам"""
            for i in self._order.product_list_transaction.all():
                package.items.append(
                    self._get_package_info(i)
                )
        return packages

    def _get_package_info(self, order_item: OrderItem) -> PackagesItems:
        return PackagesItems(
            name=order_item.productItem.product.name,
            ware_key=str(order_item.id),
            amount=order_item.count,
            cost=order_item.price.amount,
            weight=get_weight_product(order_item),
            payment=Payment(
                value=self.__get_value_packages_item(order_item)
            )

        )

    def __get_value_packages_item(self, order_item: OrderItem):
        if self.pred_payment == PrePayment.yes:
            return 0.00
        else:
            return order_item.price.amount
