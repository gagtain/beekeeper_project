from django.conf import settings
from rest_framework import serializers
import sys

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

sys.path.append('.')
from .models import Product, MainUser, Category, ImageProduct, \
    BasketItem, FavoriteItem, RatingProductReview, Type_weight
from orders.models import Order, OrderItem


class RatingProductReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = RatingProductReview
        fields = '__all__'


class RatingProductReviewRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = RatingProductReview
        fields = '__all__'
        depth = 1


class BasketInfoSerializer(serializers.Serializer):
    summ = serializers.CharField()
    count = serializers.CharField()

    class Meta:
        fields = '__all__'


class RetrieveClearAllOptionalProduct(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        """Создание динамических полей сериализатора"""
        self.Meta.fields = kwargs['context']['fields'] if not ('__all__' in kwargs['context']['fields']) else '__all__'

        super().__init__(self, *args, **kwargs)

    class Meta:
        depth = 3
        model = Product
        fields = '__all__'


class RetrieveProduct(serializers.ModelSerializer):
    favorite = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        depth = 1
        fields = ['id', 'name', 'image', 'favorite', 'description', 'list_weight']

    def get_favorite(self, instance):
        return True if self.context.get('user_id') in instance.favorite_product.all() else False

    def get_image(self, instance):
        return settings.MEDIA_URL + str(instance.image)


class CategoryRetriveSerializers(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']


class PhotoItemSerializers(serializers.ModelSerializer):
    class Meta:
        model = ImageProduct
        fields = ['photo']


class Type_weightSerializers(serializers.ModelSerializer):
    class Meta:
        model = Type_weight
        fields = ['id', 'weight']


class RetrieveProductRemoveToProdachen(serializers.ModelSerializer):
    category = CategoryRetriveSerializers(many=True)
    ImageProductList = PhotoItemSerializers(many=True)
    rating = serializers.FloatField(source='rating_product__rating__avg')
    class Meta:
        model = Product
        depth = 2
        fields = ['id', 'name', 'image', 'description', 'category', 'productItemList',
                  'ImageProductList', 'rating']


class BasketSerializer(serializers.ModelSerializer):
    class Meta:
        depth = 3
        model = BasketItem
        fields = ['id', 'productItem', 'count']


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteItem
        depth = 3
        fields = ['id', 'productItem']




class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        depth = 3
        fields = ['id', 'productItem', 'count', 'price', 'price_currency']


class OrderSerializers(serializers.ModelSerializer):
    product_list_transaction = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        depth = 2
        fields = ['id', 'amount', 'user', 'product_list_transaction', 'datetime', 'delivery', 'payment', 'status']
