import base64
import os
import re

from bs4 import BeautifulSoup
from django.conf import settings


class Image:
    name: str
    format: str
    src: bytes
    dirs: str

    def __init__(self, name, src: str, format=''):
        self.name = name
        src_list = src.split(',')
        src = base64.b64decode(src_list[1])
        self.src = src
        if format == '':
            self.format = re.search(r'/(.+?);', src_list[0]).group(1)
        else:
            self.format = format


class NewsCreateInHTML:
    soap: BeautifulSoup
    main_image: str = ''

    def __init__(self, *_, html: str, dirs: str):
        self.soap = BeautifulSoup(html, "html.parser")
        self.dirs = dirs

    def getListImage(self):
        return self.soap.findAll('img', class_='img_news')

    def createFile(self, image: Image):
        if not os.path.exists(self.dirs_upload_to()):
            os.mkdir(self.dirs_upload_to())
        with open(self.upload_to(image), 'wb') as f:
            f.write(image.src)
        return f'news/{self.dirs}/{image.name}.{image.format}'

    def image_init(self, image, count):
        """Изменить путь картинки, загрузить картинку в папку"""

        image_class = Image(name=count, src=image.get('src'))
        image['src'] = self.createFile(image_class)
        if count == 0:
            self.main_image = image['src']

    def upload_to(self, image: Image):
        return os.path.join(settings.MEDIA_ROOT, 'news', self.dirs, f'{image.name}.{image.format}')

    def dirs_upload_to(self):
        return os.path.join(settings.MEDIA_ROOT, 'news', self.dirs)

    def get_image(self, image):
        return image.get

    def genereteNews(self) -> str:
        listImage = self.getListImage()
        if len(listImage):
            for index, image in enumerate(listImage):
                self.image_init(image, index)
        return str(self.soap)
