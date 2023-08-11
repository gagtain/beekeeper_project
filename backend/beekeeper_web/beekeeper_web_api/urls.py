from .urls_directory import basket_urls, favorite_urls, main_urls, \
    order_urls, product_urls

urlpatterns = basket_urls.urlpatterns + favorite_urls.urlpatterns \
              + main_urls.urlpatterns \
              + order_urls.urlpatterns + product_urls.urlpatterns
