from django.db import models

from Resource.models import Resource

# Create your models here.


class Schedule(models.Model):
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, blank=True, verbose_name="Кабінет")
    meet_url = models.URLField(verbose_name="Посилання на заняття", max_length=1000, default=None, blank=True, null=True)
    day = models.CharField(max_length=20, verbose_name="День тижня")
    number = models.PositiveBigIntegerField(verbose_name="Номер заняття")
    