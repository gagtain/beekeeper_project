# Generated by Django 4.2.2 on 2023-06-29 19:48

from decimal import Decimal
from django.conf import settings
import django.contrib.auth.models
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import djmoney.models.fields
import online_store.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='MainUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(max_length=50, unique=True, verbose_name='логин')),
                ('FIO', models.CharField(max_length=100)),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('image', models.ImageField(blank=True, default='images/ds.png', upload_to='images/%Y/%m/%d/', verbose_name='Изображение пользователя')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
            ],
            options={
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Название категории')),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount_currency', djmoney.models.fields.CurrencyField(choices=[('EUR', 'Euro'), ('RUB', 'Russian Ruble'), ('USD', 'US Dollar')], default='RUB', editable=False, max_length=3)),
                ('amount', djmoney.models.fields.MoneyField(decimal_places=2, default=Decimal('0'), default_currency='RUB', max_digits=14, verbose_name='Сумма транзакции')),
                ('datetime', models.DateTimeField(auto_now_add=True, verbose_name='Время')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_order', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Название продукта')),
                ('description', models.CharField(blank=True, max_length=200, verbose_name='Описание')),
                ('image', models.ImageField(default='admin', upload_to='images/%Y/%m/%d/', verbose_name='Изображение товара')),
                ('price_currency', djmoney.models.fields.CurrencyField(choices=[('EUR', 'Euro'), ('RUB', 'Russian Ruble'), ('USD', 'US Dollar')], default='RUB', editable=False, max_length=3)),
                ('price', djmoney.models.fields.MoneyField(decimal_places=2, default_currency='RUB', max_digits=14, verbose_name='Цена')),
                ('count_purchase', models.IntegerField(default=0, verbose_name='кол-во покупок')),
                ('category', models.ManyToManyField(blank=True, related_name='category_list', to='online_store.category')),
            ],
        ),
        migrations.CreateModel(
            name='Type_packaging',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Название типа упаковки')),
            ],
        ),
        migrations.CreateModel(
            name='Type_weight',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('weight', models.FloatField(verbose_name='Вес в граммах')),
            ],
        ),
        migrations.CreateModel(
            name='ProductItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='productItemList', to='online_store.product')),
                ('type_packaging', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='online_store.type_packaging')),
                ('weight', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='online_store.type_weight')),
            ],
        ),
        migrations.AddField(
            model_name='product',
            name='list_weight',
            field=models.ManyToManyField(null=True, related_name='list_weight', to='online_store.type_weight'),
        ),
        migrations.AddField(
            model_name='product',
            name='type_packaging',
            field=models.ManyToManyField(blank=True, related_name='type_packaging_list', to='online_store.type_packaging'),
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('count', models.PositiveIntegerField(default=1)),
                ('order', models.ForeignKey(default=21, on_delete=django.db.models.deletion.CASCADE, related_name='product_list_transaction', to='online_store.order')),
                ('productItem', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='online_store.productitem')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ImageProduct',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('photo', models.ImageField(upload_to=online_store.models.get_galery_item_url)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ImageProductList', to='online_store.product', verbose_name='Продукт')),
            ],
        ),
        migrations.CreateModel(
            name='FavoriteItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('productItem', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='online_store.productitem')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='BasketItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('count', models.PositiveIntegerField(default=1)),
                ('productItem', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='online_store.productitem')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='mainuser',
            name='basket',
            field=models.ManyToManyField(related_name='basket', through='online_store.BasketItem', to='online_store.productitem'),
        ),
        migrations.AddField(
            model_name='mainuser',
            name='favorite_product',
            field=models.ManyToManyField(related_name='favorite_product', through='online_store.FavoriteItem', to='online_store.productitem'),
        ),
        migrations.AddField(
            model_name='mainuser',
            name='groups',
            field=models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups'),
        ),
        migrations.AddField(
            model_name='mainuser',
            name='user_permissions',
            field=models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions'),
        ),
    ]
