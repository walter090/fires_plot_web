from django.db import models
from django.core.urlresolvers import reverse


class Graphs(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=50)

    def __str__(self):
        return self.title

    @staticmethod
    def get_all():
        return Graphs.objects.all()

    def get_absolute_url(self):
        return reverse('graphs:individual', kwargs={'id': self.id})
