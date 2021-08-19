from selenium import webdriver
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from django.urls import reverse
import time

class TestRegisterPage(StaticLiveServerTestCase):

    def setUp(self):
        self.driver = webdriver.Chrome("C:/Users/matth/Desktop/Summer/Project code/dublin_busboys/functional_tests/chromedriver.exe")

    def tearDown(self):
        self.driver.quit()




    def test_successful_registration(self):

        #User creates a new account with correct inputs
        self.driver.get("http://127.0.0.1:8000/register");
        self.driver.maximize_window()
        username = self.driver.find_element_by_name("username")
        username.send_keys("testUserRegister")
        password1 = self.driver.find_element_by_name("password1")
        password1.send_keys("dublinbuspassword")
        password2 = self.driver.find_element_by_name("password2")
        password2.send_keys("dublinbuspassword")
        submit = self.driver.find_element_by_class_name("btn")
        submit.click()

        #user is redirected to login page
        self.assertIn("login", self.driver.current_url)


    def test_mismatching_password_error_message(self):

        # User creates a new account with incorrect inputs
        self.driver.get("http://127.0.0.1:8000/register");
        self.driver.maximize_window()
        username = self.driver.find_element_by_name("username")
        username.send_keys("testUserRegister3")
        password1 = self.driver.find_element_by_name("password1")
        password1.send_keys("dublinbuspassword")
        password2 = self.driver.find_element_by_name("password2")
        password2.send_keys("dublinbuspassword2")
        submit = self.driver.find_element_by_class_name("btn")
        submit.click()

        #getting error element
        error = self.driver.find_element_by_class_name("errorlist").text

        #checking error message is displayed correctly
        self.assertEquals("""password2\nThe two password fields didn’t match.""", error)



