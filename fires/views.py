from django.shortcuts import render, get_object_or_404
from .models import Graphs


def go_home(request):
    query_set = Graphs.objects.all()
    context = {
        'object_set': query_set
    }

    return render(request, 'base.html', context)


def show_graph(request, id=None):
    query_set = Graphs.objects.all()
    instance = get_object_or_404(Graphs, id=id)
    context = {
        'title': instance.title,
        'instance': instance,
        'object_set': query_set
    }
    if id == '1':
        return render(request, 'scatter.html', context)
    if id == '2':
        return render(request, 'correlation.html', context)
    if id == '3':
        return render(request, 'scatter-matrix.html')
    if id == '4':
        return render(request, 'mds.html')
    if id == '5':
        return render(request, 'pca.html')

    return render(request, 'base.html', context)


