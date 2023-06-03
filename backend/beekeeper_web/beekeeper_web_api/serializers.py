from django.conf import settings
from rest_framework import serializers
import sys

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

sys.path.append('.')
from online_store.models import UserBalanceChange, Product, MainUser


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
    
class RetrieveProductRemoveToProdachen(serializers.ModelSerializer):
    class Meta:
        model = Product
        depth = 1
        fields = ['id', 'name', 'image', 'price', 'description']



class RetrieveUser(serializers.ModelSerializer):

    class Meta:
        model = MainUser
        fields = ['username', 'FIO', 'image']


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
    
