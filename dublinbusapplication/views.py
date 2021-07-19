import json

from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.core import serializers
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
import pickle
import pandas as pd

from dublinbusapplication.predictive_model.get_prediction import *

from .models import Stop, Bikes

from scraper.weather.db_session import Session

session = Session()


def index(request):
    render_stops = Stop.objects.all().values()
    render_bike_stations = Bikes.objects.all().values()
    return render(request, 'index.html', {'stops': list(render_stops), 'stations': list(render_bike_stations)})
    # return render(request, 'index.html', {'stops': list(render_stops)})


# ajax_posting function
def predict(request):
    if request.is_ajax():
        hour = int(float(request.POST.get('hour')))
        day = int(float(request.POST.get('day')))
        month = int(float(request.POST.get('month')))

        result = int(prediction(hour, day, month, start_stop_id, end_stop_id, temp, weather_main, stops))
        return JsonResponse(result, safe=False)
        # return response as JSON


# def stops(request):
#     stops = Stop.objects.all().values()
#     return JsonResponse({'stops': list(stops)})


def about(request):
    return render(request, 'about.html')


def contact(request):
    return render(request, 'contact.html')


def search_test(request):
    return render(request, 'search_test.html')


def registerPage(request):
    if request.user.is_authenticated:
        return redirect('home')
    else:
        form = UserCreationForm()
        if request.method == 'POST':
            form = UserCreationForm(request.POST)
            if form.is_valid():
                form.save()
                user = form.cleaned_data.get('username')
                messages.success(request, "Account was created for " + user)
                return redirect('login')

        context = {'form': form}
        return render(request, 'register.html', context)


def loginPage(request):
    if request.user.is_authenticated:
        return redirect('home')
    else:
        if request.method == 'POST':
            username = request.POST.get('username')
            password = request.POST.get('password')

            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('home')
            else:
                messages.info(request, 'Username or Password is incorrect.')

    context = {}
    return render(request, 'login.html', context)


def logoutUser(request):
    logout(request)
    return redirect('login')
