# Generated by Django 5.0.7 on 2024-08-27 17:54

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofileinfo',
            name='display_name',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name='userprofileinfo',
            name='favoritedFriends',
            field=models.ManyToManyField(blank=True, related_name='favorited_friends', to=settings.AUTH_USER_MODEL),
        ),
    ]
