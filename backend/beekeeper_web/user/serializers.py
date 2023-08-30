from rest_framework import serializers

from beekeeper_web_api.serializers import BasketSerializer, FavoriteSerializer
from user.models import MainUser


class RetrieveUserDefault(serializers.ModelSerializer):
    class Meta:
        model = MainUser
        fields = ['username', 'FIO', 'image', 'is_sending']


class RetrieveUser(serializers.ModelSerializer):
    basket = BasketSerializer(many=True)
    favorite_product = FavoriteSerializer(many=True)

    class Meta:
        model = MainUser
        fields = ['username', 'FIO', 'image', 'basket', 'favorite_product', 'is_sending']


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


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=50)
    password = serializers.CharField(max_length=128)

    class Meta:
        fields = ['username', 'password']
