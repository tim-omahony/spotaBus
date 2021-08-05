from django.urls import path
from . import views
from .views import *
import dublinbusapplication

urlpatterns = [
    path('', index, name="home"),
    path('about/', views.about),
    path('contact/', views.contact),
    path('search_test/', views.search_test),
    path('login/', views.loginPage, name="login"),
    path('logout/', views.logoutUser, name="logout"),
    path('register/', views.registerPage, name="register"),
    path('predict/', predict, name='predict'),
    path('add_favourite_route/', add_favourite_route, name="add_favourite_route"),
    #path('userPage/', views.userPage, name="userPage"),
    path('userPage/', views.displayFavRoute, name='displayFavRoute'),
    path('delete_fav_route/', views.deleteUserFavJourney, name='deleteUserFavJourney')
]
