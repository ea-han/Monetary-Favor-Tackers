# Generated by Django 5.0.6 on 2024-08-13 05:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('favors', '0002_favor_total_owed_wishlist'),
    ]

    operations = [
        migrations.AddField(
            model_name='favor',
            name='bounty_edit_history',
            field=models.JSONField(blank=True, default=list),
        ),
    ]
