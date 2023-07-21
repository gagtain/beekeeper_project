from abc import ABC, abstractmethod


class AbstractPaymentService(ABC):

    @classmethod
    @abstractmethod
    def create_payment(cls, data):
        pass

    @classmethod
    @abstractmethod
    def get_initial_data(cls, data, order):
        pass

    @classmethod
    @abstractmethod
    def create_model_payment(cls, data, order):
        pass
