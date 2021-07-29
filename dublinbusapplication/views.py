from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from dublinbusapplication.predictive_model.get_prediction import *
from .models import Stop, Bikes, FavouriteJourney, user


def index(request):
    render_stops = Stop.objects.all().values()
    render_bike_stations = Bikes.objects.all().values()
    return render(request, 'index.html', {'stops': list(render_stops), 'stations': list(render_bike_stations)})


# ajax_posting function
def predict(request):
    if request.is_ajax():
        route = (request.POST.get('route'))
        hour = int(float(request.POST.get('hour')))
        day = int(float(request.POST.get('day')))
        month = int(float(request.POST.get('month')))
        wind_speed = int(float(request.POST.get('wind_speed')))
        humidity = int(float(request.POST.get('humidity')))
        temp = int(float(request.POST.get('temp')) - 273)
        start_stop_id = (request.POST.get('start_stop_id'))
        end_stop_id = (request.POST.get('end_stop_id'))
        weather_main = (request.POST.get('weather_main'))

        # converting the start and stop ids to the required format
        start_stop_id = int(start_stop_id[len(start_stop_id) - 5:])
        end_stop_id = int(end_stop_id[len(end_stop_id) - 5:])

        stops_dict = get_route(stops_sequence, route)
        print(stops_dict)
        result = int(
            prediction(route, hour, day, month, start_stop_id, end_stop_id, wind_speed, temp, humidity, weather_main,
                       stops_dict))
        print(result)
        return JsonResponse(result, safe=False)
        # return response as JSON


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


# @login_required
def add_favourite_route(request):
    for key, value in request.session.items():
        print('{} => {}'.format(key, value))
    print('request is', request)
    if request.method == 'POST':
        if request.POST.get('users_origin_stop') and request.POST.get('users_dest_stop'):
            # user = User.objects.get(id=request.session['_auth_user_id'])
            fav_journey = FavouriteJourney()
            fav_journey.users_origin_stop = request.POST.get('users_origin_stop')
            fav_journey.users_dest_stop = request.POST.get('users_dest_stop')
            fav_journey.user_id = request.session['_auth_user_id']
            fav_journey.save()

        return JsonResponse({'message': 'saved that there now you cunt'})
