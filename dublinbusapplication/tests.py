from django.test import TestCase, Client
from django.http import JsonResponse
from django.urls import reverse, resolve
from .models import *
from .views import *


class TestViews(TestCase):
    pass


# Testing URLs
class TestUrls(TestCase):

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
class StandardUserTestCase(TestCase):

    def setUp(self):
        self.user = User(email="test@email.com", username="JohnDoe", date_joined="", last_login="", is_admin=False,
                    is_active=True, is_staff=False, is_superuser=False)
        self.user.save()

        app_label = 'django.contrib.admin'

    def test_user_created(self):
        num_users = User.objects.all().count()
        self.assertEqual(num_users, 1)
        self.assertNotEqual(num_users, 0)

    def test_user_str_return_value(self):
        self.assertEqual(self.user.str(), self.user.username)

    def test_user_has_perm_return_value(self):
        self.assertEqual(self.user.has_perm(), self.user.is_admin)

    def test_user_has_module_perms_return_value(self):
        self.assertEqual(self.user.has_module_perms(), True)




class StopTestCase(TestCase):

    def setUp(self, stop_id="790", stop_name="Stephen's Green Nth", stop_lat=53.33937450876734, stop_lon=-6.258077749139876):
        self.stop = Stop.objects.create(stop_id=stop_id, stop_name=stop_name, stop_lat=stop_lat, stop_lon = stop_lon)
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

    def test_to_json_information_type(self):
        self.assertIsInstance(self.stop_to_json, dict)




