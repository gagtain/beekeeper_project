# Generated by Django 4.2.1 on 2023-05-26 11:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('online_store', '0004_alter_mainuser_image'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='mainuser',
            options={},
        ),
        migrations.AlterModelManagers(
            name='mainuser',
            managers=[
            ],
        ),
        migrations.RemoveField(
            model_name='mainuser',
            name='date_joined',
        ),
        migrations.RemoveField(
            model_name='mainuser',
            name='email',
        ),
        migrations.RemoveField(
            model_name='mainuser',
            name='first_name',
        ),
        migrations.RemoveField(
            model_name='mainuser',
            name='groups',
        ),
        migrations.RemoveField(
            model_name='mainuser',
            name='is_active',
        ),
        migrations.RemoveField(
            model_name='mainuser',
            name='is_staff',
        ),
        migrations.RemoveField(
            model_name='mainuser',
            name='is_superuser',
        ),
        migrations.RemoveField(
            model_name='mainuser',
            name='last_name',
        ),
        migrations.RemoveField(
            model_name='mainuser',
            name='user_permissions',
        ),
        migrations.RemoveField(
            model_name='mainuser',
            name='username',
        ),
        migrations.AddField(
            model_name='mainuser',
            name='login',
            field=models.CharField(default=1, max_length=50, unique=True),
        ),
    ]
