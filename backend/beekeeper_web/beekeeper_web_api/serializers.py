from django.conf import settings
from rest_framework import serializers
import sys

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

sys.path.append('.')
from online_store.models import UserBalanceChange, Product, MainUser, Category, Type_packaging, ImageProduct


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
        fields = ['id', 'name', 'image', 'price', 'favorite', 'description']

    def get_favorite(self, instance):
        return True if self.context.get('user_id') in instance['favorite_product_list'] else False

    def get_image(self, instance):
        return settings.MEDIA_URL + instance['image']
    

class Type_packagingRetriveSerializers(serializers.ModelSerializer):
    
    class Meta:
        model = Type_packaging
        fields = ['name']


class CategoryRetriveSerializers(serializers.ModelSerializer):
    
    class Meta:
        model = Category
        fields = ['name']

class PhotoItemSerializers(serializers.ModelSerializer):

    class Meta:
        model = ImageProduct
        fields = ['photo']

class RetrieveProductRemoveToProdachen(serializers.ModelSerializer):
    category = CategoryRetriveSerializers(many=True)
    type_packaging = Type_packagingRetriveSerializers(many=True)
    ImageProductList = PhotoItemSerializers(many=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'image', 'price', 'description',
                  'price_currency', 'category', 'type_packaging',
                  'ImageProductList']



class RetrieveUser(serializers.ModelSerializer):
    basket_info = serializers.SerializerMethodField()

    class Meta:
        depth = 1
        model = MainUser
        fields = ['username', 'FIO', 'image', 'basket', 'favorite_product', 'basket_info', 'balance', 'balance_currency']

    def get_basket_info(self, instance):
        return BasketInfoSerializer(self.context).data

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
    
