from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.go_home, name='home'),
    url(r'^(?P<id>\d+)$', views.show_graph, name='individual'),
]