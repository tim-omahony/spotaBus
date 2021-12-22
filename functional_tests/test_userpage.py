from selenium import webdriver
from django.contrib.staticfiles.testing import StaticLiveServerTestCase

class TestUserPage(StaticLiveServerTestCase):

    def setUp(self):
        self.driver = webdriver.Chrome("/dublin_busboys/functional_tests/chromedriver.exe")

    def tearDown(self):
        self.driver.quit()


    def test_user_metrics(self):

        #user navigates to register page
        self.driver.get("http://127.0.0.1:8000/register")
        self.driver.maximize_window()

        #user creates a new account
        username = self.driver.find_element_by_name("username")
        username.send_keys("testUserRegister4")
        password1 = self.driver.find_element_by_name("password1")
        password1.send_keys("dublinbuspassword")
        password2 = self.driver.find_element_by_name("password2")
        password2.send_keys("dublinbuspassword")
        submit = self.driver.find_element_by_class_name("btn")
        submit.click()

        #user log's into new account
        self.driver.get("http://127.0.0.1:8000/login");
        login_username = self.driver.find_element_by_name("username")
        login_username.send_keys("testUserRegister4")
        password = self.driver.find_element_by_name("password")
        password.send_keys("dublinbuspassword")
        login_btn = self.driver.find_element_by_class_name("btn")
        login_btn.click()

        #user navigates to account details page
        self.driver.get("http://127.0.0.1:8000/delete_fav_route")
        metrics = self.driver.find_element_by_id("user-metrics-div")

        #verifying default values are populated
        self.assertIn(0, metrics)
        self.assertIn(0.0, metrics)
