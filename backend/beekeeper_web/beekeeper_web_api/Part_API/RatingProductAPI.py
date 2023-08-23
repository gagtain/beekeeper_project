from django.db.models import Avg, F
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from user.services.optimize_orm import default_user_only, optimize_category
from ..models import RatingProductReview, Product

from django.db import models
from ..serializers import RatingProductReviewSerializer, RatingProductReviewRetrieveSerializer


class RatingProductCreate(APIView):

    @swagger_auto_schema(tags=['online_store'])
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

    @swagger_auto_schema(tags=['online_store'])
    def list(self, request, product_pk):
        rating_list = RatingProductReview.objects \
            .filter(product__id=product_pk).only('rating',
                                                 'user',
                                                 'product',
                                                 *default_user_only('user'),
                                                 'product__name',
                                                 'product__image',
                                                 'product__category',
                                                 'product__description'
                                                 ).select_related('user', 'product').prefetch_related(
                                                    optimize_category('product')
                                            )
        serializer = RatingProductReviewRetrieveSerializer(rating_list, many=True)
        return Response(serializer.data, status.HTTP_200_OK)


class RatingProductAVG(APIView):

    @swagger_auto_schema(tags=['online_store'])
    def get_rating_avg(self, request, product_pk):
        rating_product = Product.objects.filter(id=product_pk).values('rating_product__rating') \
            .aggregate(Avg('rating_product__rating'))
        rating_product['rating_product__rating__avg'] = round(rating_product['rating_product__rating__avg'], 2)
        return Response(rating_product)
