from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin, UserManager
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _



# Create your models here.

class MainUser(AbstractBaseUser, PermissionsMixin):
    """"Модель пользователя"""
    username = models.CharField(max_length=50, unique=True, verbose_name="логин")
    FIO = models.CharField(max_length=100, blank=False)
    email = models.EmailField(blank=False, default='asd@asd.ru')
    image = models.ImageField(upload_to="images/%Y/%m/%d/", verbose_name="Изображение пользователя",
                              blank=True, default="images/ds.png")

    USERNAME_FIELD = 'username'
    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_("Designates whether the user can log into this admin site."),
    )
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )
    date_joined = models.DateTimeField(_("date joined"), default=timezone.now)
    is_sending = models.BooleanField(default=False, blank=True)

    objects = UserManager()

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = u"Пользователь"
        verbose_name_plural = u"Пользователи"

