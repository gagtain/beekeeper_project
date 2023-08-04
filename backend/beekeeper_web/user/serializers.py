from rest_framework import serializers

from beekeeper_web_api.models import BasketItem, FavoriteItem
from beekeeper_web_api.serializers import BasketSerializer, FavoriteSerializer
from user.models import MainUser


class RetrieveUser(serializers.ModelSerializer):
    basket = serializers.SerializerMethodField()
    favorite_product = serializers.SerializerMethodField()

    class Meta:
        depth = 2  # исправить
        model = MainUser
        fields = ['username', 'FIO', 'image', 'basket', 'favorite_product', 'is_sending']

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


class UserImageSerializers(serializers.ModelSerializer):
    class Meta:
        model = MainUser
        fields = ['image']
