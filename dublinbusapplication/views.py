from django.http import JsonResponse
from django.core.mail import send_mail
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from dublinbusapplication.predictive_model.get_prediction import *
from dublinbusapplication.predictive_model.get_times import *
from .models import Stop, Bikes, UserAccountMetrics
from django.views.generic import View
from django.views.generic.edit import DeleteView
from dublinbusapplication.models import FavouriteJourney
from django.contrib.auth.models import User
from django.db.models import F
from django.http import HttpResponse, HttpResponseRedirect
import requests


# stops, render_bike_stations and favourites are parsed as JSON to allow them to be used in HTML
def index(request):
    stops = Stop.objects.all().values()
    render_bike_stations = Bikes.objects.all().values()
    if request.user.is_authenticated:
        favourites = FavouriteJourney.objects.filter(user=request.user).values()
        return render(request, 'index.html', {'stops': list(stops), 'stations': list(render_bike_stations),
                                              'favourites': list(favourites)})
    else:
        return render(request, 'index.html', {'stops': list(stops), 'stations': list(render_bike_stations)})


def predict(request):
    """ The main prediction function that takes an AJAX post request to retrieve the parameters needed in order to
    produce a prediction for the user on the front end, along with the journey step response, the weather response
    and the prediction type which are then all sent back in the AJAX response"""

    # getting the current and forecasted weather along with the date chosen by the user
    current_weather = json.loads(request.POST["current_weather"])
    weather_forecast = json.loads(request.POST["weather_forecast"])
    date_time = json.loads(request.POST["date_time"])

    # dividing by 1000 to convert to same unix format as OpenWeather API
    date_time = int(date_time / 1000)

    # merging the weather data
    full_weather = current_weather + weather_forecast

    # calling the functions that takes the full weather forecast and match the users input time with the closest time
    # and then returns the dictionary of the weather forecast items for that time.
    time_list = get_time_list(full_weather)
    nearest_time = nearest(date_time, time_list)
    final_weather_dict = get_time(full_weather, nearest_time)

    # sending a post request for the journey steps array
    journey_steps = json.loads(request.POST["steps_array"])

    journey = open(filePath('all_routes_dict_new_key.json'))
    journey_analytics = json.load(journey)

    # need to functionalise this section for user metrics
    full_distance = journey_steps[0]['full_distance']
    print(full_distance)

    try:
        UserAccountMetrics.objects.filter(username=request.user).update(
            total_distance_planned=F("total_distance_planned") + round((full_distance / 1000), 2))
        UserAccountMetrics.objects.filter(username=request.user).update(
            total_trips_planned=F("total_trips_planned") + 1)

    except Exception as e:
        print(e)
        print("Could not update user record")

    try:
        # retrieving the stops data such that the latitude and longitude coordinates can be matched up
        # with the closest stop id
        stop_ids = open(filePath('stop_IDs.json'))
        stop = json.load(stop_ids)

        # array to hold the final estimate
        final_estimate = []

        # iterating over the steps array
        for i in range(0, len(journey_steps)):
            if journey_steps[i]["transit_type"] == "TRANSIT":

                # retrieving the start and end stop lat and long coordinates, as well as the route number
                start_stop_lat_lon = (journey_steps[i]['start_stop_lat_lon'])
                end_stop_lat_lon = (journey_steps[i]['end_stop_lat_lon'])
                route = (journey_steps[i]['route'])

                analytics = journey_analytics[route]

                # splitting the coordinates into a comma seperated list of strings
                start_stop_lat_lon_split = start_stop_lat_lon.split(",")
                end_stop_lat_lon_split = end_stop_lat_lon.split(",")

                # creating a array of dictionaries containing the stop id, lat and long coordinates of every stop
                data_list = []
                for item in stop:
                    adict = {'id': item['stop_id'], 'lat': item['stop_lat'], 'lon': item['stop_lon']}
                    data_list.append(adict)

                # reformatting the start and end stop coordinates to match stops array
                start_stop = {'lat': float(start_stop_lat_lon_split[0]), 'lon': float(start_stop_lat_lon_split[1])}
                end_stop = {'lat': float(end_stop_lat_lon_split[0]), 'lon': float(end_stop_lat_lon_split[1])}

                # calling the closest function which determines the closest stop id by distance
                closest_start_id = (closest(data_list, start_stop))
                closest_end_id = (closest(data_list, end_stop))

                # retrieving the stop ids from the dictionary
                start_id_full = closest_start_id['id']
                end_id_full = closest_end_id['id']

                if request.is_ajax():
                    # making an AJAX post request to retrieve the time and date.
                    hour = int(float(request.POST.get('hour')))
                    day = int(float(request.POST.get('day')))
                    month = int(float(request.POST.get('month')))

                    # weather conditions retrieved form the dictionary created above
                    wind_speed = float(final_weather_dict['wind_speed'])
                    humidity = float(final_weather_dict['humidity'])
                    temp = float(final_weather_dict['humidity'] - 273)
                    weather_main = (final_weather_dict['weather_main'])

                    # converting the start and stop ids to the required format
                    start_stop_id = int(start_id_full[len(start_id_full) - 5:])
                    end_stop_id = int(end_id_full[len(end_id_full) - 5:])

                    print("ids", start_stop_id, end_stop_id)

                    # calling the get_route function which returns the dictionary of required stops
                    stops_dict = get_route(stops_sequence, route)

                    # calling the prediction function to get the final prediction
                    result = prediction(route, hour, day, month, start_stop_id, end_stop_id, wind_speed, temp, humidity,
                                        weather_main,
                                        stops_dict)

                    # creating the transit time key for the journey steps to be passed pack in the AJAX response
                    journey_steps[i]["transit_time"] = result
                    journey_steps[i]["analytics"] = analytics

                    # appending the result to the final estimate array
                    final_estimate.append(result)

                    # getting the sum of the array
                    result = sum(final_estimate)

                    # creating a response type dictionary so that a message can be displayed if a google prediction
                    # is used
                    type_dict = {'type': 'ours'}

                    # creating the response dictionary
                    response = {
                        'journey_steps_response': journey_steps,
                        'JourneyTime': result,
                        'Weather': final_weather_dict,
                        'prediction_type': type_dict,
                    }

        # returning the JSON response
        return JsonResponse(response, safe=False)

    # in the case where an exception is raised the google journey time will be used
    # this generally will only occur in cases where the route being called did not exist in 2018
    # or in cases where there is a key error as the stop id does not correspond to the route number

    except Exception as e:
        print("getting google result because:", e)

        google_time_result = []

        # iterating over the steps array
        for i in range(0, len(journey_steps)):
            if journey_steps[i]["transit_type"] == "TRANSIT":

                google_time = int(journey_steps[i]["Google_Journey_time"])
                route = (journey_steps[i]['route'])

                try:
                    analytics = journey_analytics[route]
                    journey_steps[i]["analytics"] = analytics

                except:
                    pass

                # adding the google time to the journey steps dictionary
                journey_steps[i]["transit_time"] = google_time

                # adding the time to the google time results array and getting the sum
                google_time_result.append(google_time)
                result = sum(google_time_result)

                # creating the response dictionary
                type_dict = {'type': 'google'}
                response = {
                    'journey_steps_response': journey_steps,
                    'JourneyTime': result,
                    'Weather': final_weather_dict,
                    'prediction_type': type_dict,
                }

            # returning the JSON response
        return JsonResponse(response, safe=False)


# function to render about.html as a landing page
def about(request):
    return render(request, 'about.html')


# function to render contact.html as a landing page
def contact(request):


    if request.method == 'POST':

        if request.POST.get('comment') != "":
            email = request.POST.get('email')
            topic = request.POST.get('topic')
            comment = request.POST.get('comment')

            data = {"email": email,
                    "topic": topic,
                    "comment": comment}

            print(data)

            message = """
            New message: {}
    
            Topic: {}
    
            From: {}
    
            """.format(data['comment'], data['topic'], data['email'])

            send_mail(f"New contact us form message on {data['topic']}", message, '', ['spotabus@gmail.com'])


            messages.success(request, 'Form submission successful.')

            return render(request, 'contact.html')
        else:

            messages.error(request, 'Comment field blank, please leave a comment!')

            return render(request, 'contact.html')




    return render(request, 'contact.html')



# this function allows users to register their own account
def register_page(request):
    # only allows users that are not logged in to be able to view the register page, if not they are redirected to
    # homepage
    if request.user.is_authenticated:
        return redirect('home')
    else:
        # using django's built in Form to get username and password as input from the user
        form = UserCreationForm()
        # if the request is a POST request and the form is filled in correctly, the user is saved to the database
        if request.method == 'POST':
            form = UserCreationForm(request.POST)
            if form.is_valid():
                form.save()
                user = form.cleaned_data.get('username')
                UserAccountMetrics.objects.create(total_distance_planned=0, total_trips_planned=0, username=user)

                messages.success(request, "Account was created for " + user)
                return redirect('login')

        context = {'form': form}
        return render(request, 'register.html', context)


# function to view the login page for users that are not logged in
def login_page(request):
    if request.user.is_authenticated:
        return redirect('home')
    else:
        # if its a POST request, the username and password is retrieved from the Form and checked against the database
        if request.method == 'POST':
            username = request.POST.get('username')
            password = request.POST.get('password')
            # checking if username and password is correct
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('home')
            else:
                messages.info(request, 'Username or Password is incorrect.')

    context = {}
    return render(request, 'login.html', context)


# function that logs user out and returns to login page
def logout_user(request):
    logout(request)
    return redirect('login')


# this function allows for routes to be saved to the user's favourite routes
def add_favourite_route(request):
    if request.method == 'POST':
        # if the request is a POST request and the user has entered a start and end point, the function saves
        # the start and end point as origin and destination in the favourite routes table
        if request.POST.get('users_origin_stop') and request.POST.get('users_dest_stop'):
            fav_journey = FavouriteJourney()
            fav_journey.users_origin_stop = request.POST.get('users_origin_stop')
            fav_journey.users_dest_stop = request.POST.get('users_dest_stop')
            fav_journey.user_id = request.session['_auth_user_id']
            fav_journey.save()

        return JsonResponse({'message': 'Successfully saved you beautiful human being'})


# def userPage(request):
#    return render(request, 'userpage.html')


# function to display and delete favorite route using django's built in View module
class DisplayFavRoute(View):
    # function to retrieve user specific favorite routes from the database and display them
    def get(self, request):
        user_routes = FavouriteJourney.objects.filter(user_id=request.user)

        try:
            user_metrics = UserAccountMetrics.objects.values_list('total_distance_planned', 'total_trips_planned').get(
                username=request.user)
        except:
            # catch legacy/admin users who didn't have AccountMetrics on creation
            UserAccountMetrics.objects.create(total_distance_planned=0, total_trips_planned=0, username=request.user)
            user_metrics = [0, 0]

        return render(request, 'userpage.html',
                      {'user_routes': user_routes, 'total_distance_planned': round(user_metrics[0], 2),
                       'total_trips_planned': user_metrics[1]})

    # function to get the specific chosen favorite route IDs from the user on the userpage, and finding them in the
    # database before deleting them from the database
    def post(self, request, *args, **kwargs):
        if request.method == "POST":
            route_ids = request.POST.getlist('id[]')
            for id in route_ids:
                fav_route = FavouriteJourney.objects.get(pk=id)
                fav_route.delete()
            return redirect('deleteUserFavJourney')


# function to delete user from the database
def del_user(request):
    if request.method == "POST":
        user_id = request.user.id
        user_account = User.objects.get(pk=user_id)
        user_account.delete()
    return redirect('home')
