from django.shortcuts import render
from .models import Graphs


def go_home(request):
    query_set = Graphs.objects.all()
    context = {
        'object_set': query_set
    }

    return render(request, 'base.html', context)
