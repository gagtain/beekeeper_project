from django.http import HttpRequest
from django.shortcuts import render

from ..services.User import ServicesUser
from ..services.product import ServicesProduct


# Create your views here.


def index(request: HttpRequest):
    """Главная страница"""
    popular_product = ServicesProduct.getPopular(3)

    context = {
        'popular_product': popular_product
    }

    return render(request=request, template_name='index.html', context=context)


def catalog(request: HttpRequest):
    """Получение страницы каталога по номеру пагинации"""
    try:
        page = request.GET['page']
    except:
        page = 1

    paginators_product, page = ServicesProduct.getPageCatalog(page=page)

    context = {
        'page_pr': paginators_product,
        'page': page
    }
    return render(request=request, template_name='catalog.html', context=context)


def profile(request: HttpRequest):

    return render(request=request, template_name='account.html')

def basket(request: HttpRequest):

    return render(request=request, template_name='basket.html')




