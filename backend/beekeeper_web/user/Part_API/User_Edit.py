from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response

from user.models import MainUser
from user.serializers import UserImageSerializers


class UserImageEdit:
    @swagger_auto_schema(tags=['user'])
    def image_edit(self, request):
        serializer = UserImageSerializers(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.update(instance=request.user, validated_data=serializer.validated_data)
        data = {
            'image': instance.image.url
        }
        return Response(data, status=200)

def user_number_mask(number: str):

    return f'+{number[0:4]}****{number[-2:]}'

class GetUserNumber:
    @swagger_auto_schema(tags=['user'])
    def get_user_number(self, request):
        return Response(data={
            'number': user_number_mask(request.user.number)
        })
