from django.conf import settings
from rest_framework import serializers
import sys

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

sys.path.append('.')
from .models import Product, MainUser, Category, ImageProduct, \
    BasketItem, ProductItem, FavoriteItem, Order, RatingProductReview, Type_weight, OrderItem


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
        fields = ['id', 'name', 'image', 'price', 'favorite', 'description', 'list_weight', 'type_packaging']

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
        fields = ['id','weight']
        
class RetrieveProductRemoveToProdachen(serializers.ModelSerializer):
    category = CategoryRetriveSerializers(many=True)
    ImageProductList = PhotoItemSerializers(many=True)
    list_weight = Type_weightSerializers(many=True)
    rating = serializers.FloatField(source='rating_product__rating__avg')
    class Meta:
        model = Product
        fields = ['id', 'name', 'image', 'price', 'description',
                  'price_currency', 'category',
                  'ImageProductList', 'list_weight', 'rating']


class BasketSerializer(serializers.ModelSerializer):

    class Meta:
        depth = 3
        model = BasketItem
        fields = ['id','productItem','count']


class FavoriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = FavoriteItem
        depth = 3
        fields = ['id','productItem']
class RetrieveUser(serializers.ModelSerializer):
    basket = serializers.SerializerMethodField()
    favorite_product = serializers.SerializerMethodField()
    class Meta:
        depth = 2 # исправить
        model = MainUser
        fields = ['username', 'FIO', 'image', 'basket', 'favorite_product']



    def get_basket(self, instance):
        return BasketSerializer(BasketItem.objects.filter(user=self.context['user_id']), many=True).data

    def get_favorite_product(self, instance):
        return FavoriteSerializer(FavoriteItem.objects.filter(user=self.context['user_id']), many=True).data
class UserRegisterSerializers(serializers.ModelSerializer):
    password2 = serializers.CharField()

    class Meta:
        model = MainUser
        fields = ['username', 'email', 'FIO', 'password', 'password2']

    def validate_password2(self, value):
        
        password2 = self.initial_data['password2']
        password = self.initial_data['password']
        if password2 != password:
            raise serializers.ValidationError('Данное поле не совпадает с полем пароля')
        return password2
    
    def save(self):

        user = MainUser.objects.create_user(
            username=self.validated_data['username'],
            password=self.validated_data['password'],
            FIO=self.validated_data['FIO'],
            email=self.validated_data['email'],
        )

        return user

class OrderItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderItem
        depth = 3
        fields = ['id','productItem','count']

class OrderSerializers(serializers.ModelSerializer):
    product_list_transaction = OrderItemSerializer(many=True)
    class Meta:
        model = Order
        depth = 2
        fields = ['id','amount', 'user', 'product_list_transaction', 'datetime', 'delivery']