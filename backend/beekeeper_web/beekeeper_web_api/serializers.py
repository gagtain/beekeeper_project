from django.conf import settings
from rest_framework import serializers
import sys

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

sys.path.append('.')
from online_store.models import UserBalanceChange, Product, MainUser, Category, Type_packaging, ImageProduct, \
    Type_weight, BasketItem


class BasketInfoSerializer(serializers.Serializer):
    summ = serializers.CharField()
    count = serializers.CharField()

    class Meta:
        fields = '__all__'


class RetrieveUserBalanceChange(serializers.ModelSerializer):
    class Meta:
        model = UserBalanceChange
        depth = 1
        fields = ['amount', 'tovar_list', 'datetime']

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
    

class Type_packagingRetriveSerializers(serializers.ModelSerializer):
    
    class Meta:
        model = Type_packaging
        fields = ['id','name']


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
    type_packaging = Type_packagingRetriveSerializers(many=True)
    ImageProductList = PhotoItemSerializers(many=True)
    list_weight = Type_weightSerializers(many=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'image', 'price', 'description',
                  'price_currency', 'category', 'type_packaging',
                  'ImageProductList', 'list_weight']


class BasketSerializer(serializers.ModelSerializer):

    class Meta:
        depth = 2
        model = BasketItem
        fields = ['id','weight','product','count']


class RetrieveUser(serializers.ModelSerializer):
    basket_info = serializers.SerializerMethodField()
    basket = serializers.SerializerMethodField()
    class Meta:
        depth = 2 # исправить
        model = MainUser
        fields = ['username', 'FIO', 'image', 'basket', 'favorite_product', 'basket_info', 'balance', 'balance_currency']

    def get_basket_info(self, instance):
        return BasketInfoSerializer(self.context['basket_info']).data

    def get_basket(self, instance):
        return BasketSerializer(BasketItem.objects.filter(user=self.context['user_id']), many=True).data
class UserRegisterSerializers(serializers.ModelSerializer):
    password2 = serializers.CharField()

    class Meta:
        model = MainUser
        fields = ['username', 'FIO', 'password', 'password2']

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
        )

        return user
    
