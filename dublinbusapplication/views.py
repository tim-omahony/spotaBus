import json

from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.core import serializers

from .models import Stop

from scraper.weather.db_session import Session

session = Session()


def index(request):
    return render(request, 'index.html')


def stops(request):
    stops = Stop.objects.all().values()
    return JsonResponse({'stops': list(stops)})

def about(request):
    return render(request, 'about.html')

def contact(request):
    return render(request, 'contact.html')

def search_test(request):
    return render(request, 'search_test.html')
