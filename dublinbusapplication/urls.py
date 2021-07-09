from django.urls import path
from . import views
import dublinbusapplication

urlpatterns = [
    path('', views.index, name="home"),
    path('stops/', views.stops),
    path('about/', views.about),
    path('contact/', views.contact),
    path('search_test/', views.search_test),
    path('login/', views.loginPage, name="login"),
    path('logout/', views.logoutUser, name="logout"),
    path('register/', views.registerPage, name="register")
]
