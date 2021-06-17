from django.http import HttpResponse
from django.shortcuts import render
from .models import Buses


def index(request):
    buses = Buses.objects.all()
    return render(request, 'index.html', {'Buses': buses})


def new(request):
    return HttpResponse("New Page")


