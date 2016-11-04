from django.db import models


class Graphs(models.Model):
    title = models.CharField(max_length=50)

    def __str__(self):
        return self.title

    @staticmethod
    def get_all():
        return Graphs.objects.all()