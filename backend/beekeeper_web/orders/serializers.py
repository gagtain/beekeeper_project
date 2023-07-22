from rest_framework import serializers


class SumSerializer(serializers.Serializer):
    sum = serializers.CharField()

    class Meta:
        fields = ['sum']
