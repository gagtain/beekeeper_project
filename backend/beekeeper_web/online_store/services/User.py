from ..models import MainUser, UserBalanceChange


class ServicesUser:

    @classmethod
    def getLastOrder(cls, user_id: int) -> UserBalanceChange:
        LastOrder = UserBalanceChange.objects.filter(user__id=user_id).values('amount', 'tovar_list', 'datetime')
        return LastOrder