from rest_framework import serializers

from sending.models import EmailSending


class EmailSendingSerializer(serializers.ModelSerializer):

    class Meta:
        model = EmailSending
        fields = ['user', 'email']