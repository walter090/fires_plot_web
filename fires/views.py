from django.shortcuts import render, get_object_or_404
from .models import Graph


def go_home(request):
    query_set = Graph.objects.all()
    context = {
        'object_set': query_set
    }

    return render(request, 'base.html', context)


def show_dashboard(request):
    context = {
        'title': 'Dashboard',
        'object_set': Graph.objects.all(),
    }
    return render(request, 'dashboard.html', context)


def show_map(request):
    context = {
        'object_set': Graph.objects.all(),
        'title': 'Map'
    }
    return render(request, 'map.html', context)


def show_graph(request, id=None):
    query_set = Graph.objects.all()
    instance = get_object_or_404(Graph, id=id)
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
        return render(request, 'scatter-matrix.html', context)
    if id == '4':
        return render(request, 'mds.html', context)
    if id == '5':
        return render(request, 'pca.html', context)
    if id == '6':
        return render(request, 'parallel.html', context)

    return render(request, 'base.html', context)


