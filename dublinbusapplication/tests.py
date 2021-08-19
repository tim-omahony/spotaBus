# Importing Django BuiltIn modules for testing along with custom models and views

from django.contrib.auth.models import AnonymousUser, User
from django.test import TestCase, Client, RequestFactory

from django.http import JsonResponse
from django.urls import reverse, resolve

from django.db import connection

from .models import *
from .views import *


class DataBaseConnection(TestCase):

    def testConnection(self):
        self.assertEqual(connection.ensure_connection(), None)


class TestViews(TestCase):
    pass


class TestUrlResolutions(TestCase):

    def test_resolution_for_no_input(self):
        view = resolve('/')
        self.assertEquals(view.func, index)

    def test_resolution_home(self):
        url = reverse('home')
        self.assertEquals(resolve(url).func, index)

    def test_resolution_login(self):
        url = reverse('login')
        self.assertEquals(resolve(url).func, login_page)

    def test_resolution_logout(self):
        url = reverse('logout')
        self.assertEquals(resolve(url).func, logout_user)

    def test_resolution_register(self):
        url = reverse('register')
        self.assertEquals(resolve(url).func, register_page)

    def test_resolution_predict(self):
        url = reverse('predict')
        self.assertEquals(resolve(url).func, predict)

    def test_resolution_add_favourite_route(self):
        url = reverse('add_favourite_route')
        self.assertEquals(resolve(url).func, add_favourite_route)

    def test_resolution_delete_UserFav_Journey(self):
        url = reverse('deleteUserFavJourney')
        self.assertEquals(resolve(url).func, DisplayFavRoute)

    def test_resolution_delete_user(self):
        url = reverse('deleteuser')
        self.assertEquals(resolve(url).func, del_user)


class ResponseTemplateContentTests(TestCase):

    # setting up test URL variables
    def setUp(self):
        self.client = Client()
        self.home_url = '/'
        self.about_url = '/about/'
        self.contact_url = '/contact/'
        self.register_url = '/register/'
        self.login_url = '/login/'

    # Home page tests
    def test_home_response_code(self):
        response = self.client.get(self.home_url)
        self.assertEqual(response.status_code, 200)

    def test_home_template_used(self):
        response = self.client.get(self.home_url)
        self.assertTemplateUsed(response, 'index.html')

    def test_home_content_returned(self):
        response = self.client.get(self.home_url)
        self.assertNotEqual(response.content, "")

    def test_holiday_widget_hidden(self):
        response = self.client.get("/")
        self.assertContains(response, """<div id="holidayWidget" style="visibility: hidden;"></div>""", status_code=200)

    def test_holiday_widget_hidden(self):
        response = self.client.get("/")
        self.assertContains(response, """<div id="journeyComparer" style="display: none;">""", status_code=200)

    def test_empty_analytics_div(self):
        response = self.client.get("/")
        self.assertContains(response, """<div id="analytics-output"></div>""", status_code=200)




    # About page test
    def test_about_response_code(self):
        response = self.client.get(self.about_url)
        self.assertEqual(response.status_code, 200)

    def test_about_template_used(self):
        response = self.client.get(self.about_url)
        self.assertTemplateUsed(response, 'about.html')

    def test_about_content_returned(self):
        response = self.client.get(self.about_url)
        self.assertNotEqual(response.content, "")

    # Contact page tests
    def test_contact_response_code(self):
        response = self.client.get(self.contact_url)
        self.assertEqual(response.status_code, 200)

    def test_contact_template_used(self):
        response = self.client.get(self.contact_url)
        self.assertTemplateUsed(response, 'contact.html')

    def test_contact_content_returned(self):
        response = self.client.get(self.contact_url)
        self.assertNotEqual(response.content, "")

    # Register page tests

    def test_register_page_response_code(self):
        response = self.client.get(self.register_url)
        self.assertEqual(response.status_code, 200)

    def test_register_template_used(self):
        response = self.client.get(self.register_url)
        self.assertTemplateUsed(response, 'register.html')

    def test_register_content_returned(self):
        response = self.client.get(self.register_url)
        self.assertNotEqual(response.content, "")

    # Login page tests

    def test_login_page_response_code(self):
        response = self.client.get(self.login_url)
        self.assertEqual(response.status_code, 200)

    def test_login_template_used(self):
        response = self.client.get(self.login_url)
        self.assertTemplateUsed(response, 'login.html')

    def test_login_content_returned(self):
        response = self.client.get(self.login_url)
        self.assertNotEqual(response.content, "")


# Testing Models

# Not sure whether to move forward with this
# class StandardUserTestCase(TestCase):
#
#     def setUp(self):
#         self.user = User(email="test@email.com", username="JohnDoe", date_joined="", last_login="", is_admin=False,
#                          is_active=True, is_staff=False, is_superuser=False)
#         self.user.save()
#
#         app_label = 'django.contrib.admin'
#
#     def test_user_created(self):
#         num_users = User.objects.all().count()
#         self.assertEqual(num_users, 1)
#         self.assertNotEqual(num_users, 0)
#
#     def test_user_str_return_value(self):
#         self.assertEqual(self.User.str(), self.User.username)
#
#     def test_user_has_perm_return_value(self):
#         self.assertEqual(self.User.has_perm(), self.User.is_admin)
#
#     def test_user_has_module_perms_return_value(self):
#         self.assertEqual(self.User.has_module_perms(), True)


class StopTestCase(TestCase):

    def setUp(self, stop_id="790", stop_name="Stephen's Green Nth", stop_lat=53.33937450876734,
              stop_lon=-6.258077749139876):
        self.stop = Stop.objects.create(stop_id=stop_id, stop_name=stop_name, stop_lat=stop_lat, stop_lon=stop_lon)
        self.stop_to_json = self.stop.to_json()

    def test_stop_information_types(self):
        """
        Tests stop model to verify datatypes are congruent with model structure

        :return: standard unittest output
        """

        self.assertIsInstance(self.stop.stop_id, str)
        self.assertIsInstance(self.stop.stop_name, str)
        self.assertIsInstance(self.stop.stop_lat, float)
        self.assertIsInstance(self.stop.stop_lon, float)

    # testing return type of to-json function
    def test_to_json_information_type(self):
        self.assertIsInstance(self.stop_to_json, dict)


class FavouriteJourneyTestCase(TestCase):

    def setUp(self, users_origin_stop="University College Dublin, Belfield, Dublin 4, Ireland",
              users_dest_stop="Donnybrook Castle, Dublin, Ireland", user=1,
              username="testUser"):
        self.journey = FavouriteJourney.objects.create(users_origin_stop=users_origin_stop,
                                                       users_dest_stop=users_dest_stop, user=user, username=username)

    def test_variable_types(self):
        """
        Tests stop model to verify datatypes are congruent with model structure

        :return: standard unittest output
        """

        self.assertIsInstance(self.journey.users_origin_stop, str)
        self.assertIsInstance(self.journey.users_dest_stop, str)
        self.assertIsInstance(self.journey.user, int)
        self.assertIsInstance(self.journey.username, str)

    def test_dunder_str(self):
        self.assertIsEqual()


class FavouriteJourneyTestCase(TestCase):

    def setUp(self, users_origin_stop="University College Dublin, Belfield, Dublin 4, Ireland",
              users_dest_stop="Donnybrook Castle, Dublin, Ireland", user=1,
              username="testUser"):
        self.journey = FavouriteJourney.objects.create(users_origin_stop=users_origin_stop,
                                                       users_dest_stop=users_dest_stop,
                                                       user=User.objects.create_user(username='testuser',
                                                                                     password='12345'),
                                                       username=username)

    def test_variable_types(self):
        """
        Tests stop model to verify datatypes are congruent with model structure

        :return: standard unittest output
        """

        self.assertIsInstance(self.journey.users_origin_stop, str)
        self.assertIsInstance(self.journey.users_dest_stop, str)
        self.assertIsInstance(self.journey.user, User)
        self.assertIsInstance(self.journey.username, str)

    def test_dunder_str(self):
        self.assertEqual(self.journey.__str__(),
                         f"Route: {self.journey.users_origin_stop} to stop {self.journey.users_dest_stop}")


class UserAccountMetricsTestCase(TestCase):

    def setUp(self, total_distance_planned=0.0,
              total_trips_planned=0,
              username="testUser"):
        self.user_account_metric = UserAccountMetrics.objects.create(total_distance_planned=total_distance_planned,
                                                                     total_trips_planned=total_trips_planned,
                                                                     username=username
                                                                     )

    def test_variable_types(self):
        """
        Tests stop model to verify datatypes are congruent with model structure

        :return: standard unittest output
        """

        self.assertIsInstance(self.user_account_metric.total_distance_planned, float)
        self.assertIsInstance(self.user_account_metric.total_trips_planned, int)
        self.assertIsInstance(self.user_account_metric.username, str)


class BikesTestCase(TestCase):

    def setUp(self, Number=42,
              Name="SMITHFIELD NORTH",
              Address="Smithfield North",
              Latitude=53.349562,
              Longitude=-6.278198):
        self.bike_stop = Bikes.objects.create(Number=Number, Name=Name, Address=Address, Latitude=Latitude,
                                              Longitude=Longitude)

    def test_variable_types(self):
        self.assertIsInstance(self.bike_stop.Number, int)
        self.assertIsInstance(self.bike_stop.Name, str)
        self.assertIsInstance(self.bike_stop.Address, str)
        self.assertIsInstance(self.bike_stop.Latitude, float)
        self.assertIsInstance(self.bike_stop.Longitude, float)


class RegisterTest(TestCase):
    def setUp(self):
        self.registration_form_data = {
            'username': 'testuser1',
            'password1': 'dublinbuspassword',
            'password2': 'dublinbuspassword'}

        self.user_count = User.objects.count()

    def test_registration_success(self):
        # getting number of users

        # getting response data
        response = self.client.post('/register/', self.registration_form_data, follow=True)

        # verifying user is active via response contact
        self.assertEqual(response.status_code, 200)
        self.assertEqual(User.objects.count(), self.user_count + 1)


class LogInTest(TestCase):
    def setUp(self):
        self.credentials = {
            'username': 'testuser1',
            'password': 'dublinbuspassword'}
        User.objects.create_user(**self.credentials)

    def test_login_success(self):
        # logging user in
        response = self.client.post('/login/', self.credentials, follow=True)

        # verifying user is active via response contact
        self.assertTrue(response.context['user'].is_active)

#     def test_logout_success(self):
#         response = self.client.post('/login/', self.credentials, follow=True)
#
#         # verifying user is active via response contact
#         self.assertTrue(response.context['user'].is_active)
#
#         self.client.post('/logout/')
#
#         print(self.user.is_authenticated)
#
#         self.assertEqual(self.user.is_authenticated(), False)
#
# #
# class ViewTest(TestCase):
#
#     def setUp(self):
#         self.factory = RequestFactory()
#
#
#
#
#     def test_details(self):
#         request = self.factory.get('/')
#         request.user = AnonymousUser()
#         response = index(request)
#         print(response.content)







# class TestUserMetricsCreation(TestCase):
#
#     def setUp(self):
#         self.credentials = {
#             'username': 'testuser1',
#             'password': 'dublinbuspassword'}
#         self.user = User.objects.create_user(**self.credentials)
#         self.metric_count = UserAccountMetrics.objects.count()
#
#
#     def test_successful_metric_creation(self):
#
#         self.assertEqual(UserAccountMetrics.objects.count(), self.metric_count + 1)
