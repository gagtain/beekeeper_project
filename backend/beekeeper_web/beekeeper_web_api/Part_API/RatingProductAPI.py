from django.db.models import Avg, F
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from ..models import RatingProductReview, Product

from django.db import models
from ..serializers import RatingProductReviewSerializer, RatingProductReviewRetrieveSerializer


class RatingProductCreate(APIView):

    def create(self, request, product_pk):
        if RatingProductReview.objects.filter(product__id=product_pk, user__id=request.user.id).exists():
            return Response({'error': 'Вы уже оставили отзыв на данный товар'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = RatingProductReviewSerializer(data={
            'product': product_pk,
            'user': request.user.id,
            'rating': request.data['rating']
        })
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class RatingProductList(APIView):

    def list(self, request, product_pk):
        serializer = RatingProductReviewRetrieveSerializer(RatingProductReview.objects.filter(product__id=product_pk), many=True)
        return Response(serializer.data, status.HTTP_200_OK)


class RatingProductAVG(APIView):

    def get_rating_avg(self, request, product_pk):
        rating_product = Product.objects.filter(id=product_pk).values('rating_product__rating')\
            .aggregate(Avg('rating_product__rating'))
        rating_product['rating_product__rating__avg'] = round(rating_product['rating_product__rating__avg'], 2)
        return Response(rating_product)