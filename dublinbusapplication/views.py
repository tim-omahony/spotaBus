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
    # data = serializers.serialize('json', Stop.objects.all().values())
    # return HttpResponse(data, content_type="application/json")
    # stops = JsonResponse(Stop.objects.all().values(), safe=False)
    # return render(request, 'index.html', {'stops': json.loads(stops)})
