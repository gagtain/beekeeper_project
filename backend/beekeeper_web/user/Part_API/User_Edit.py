from rest_framework.response import Response

from user.models import MainUser
from user.serializers import UserImageSerializers


class UserImageEdit:
    def image_edit(self, request):
        serializer = UserImageSerializers(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.update(instance=request.user, validated_data=serializer.validated_data)
        data = {
            'image': instance.image.url
        }
        return Response(data, status=200)
