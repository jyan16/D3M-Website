# Generated by Django 2.0.4 on 2018-04-25 20:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backendApp', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dataset',
            name='number',
        ),
    ]