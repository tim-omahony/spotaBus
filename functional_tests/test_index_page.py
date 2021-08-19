from selenium import webdriver
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from django.urls import reverse
import time

class TestIndexPage(StaticLiveServerTestCase):

    def setUp(self):
        self.driver = webdriver.Chrome("C:/Users/matth/Desktop/Summer/Project code/dublin_busboys/functional_tests/chromedriver.exe")

    def tearDown(self):
        self.driver.quit()

    def test_why_take_bus_hidden(self):

        #user navigates to homepage
        self.driver.get("http://127.0.0.1:8000/");
        self.driver.maximize_window()

        #user clicks modal box button
        plan_button = self.driver.find_element_by_id('planButton')
        plan_button.click()


        #give time for DOM to execute
        time.sleep(2)


        # retrieving div style
        element = self.driver.find_element_by_id("top-card")
        attribute_value = element.get_attribute("style")

        # checking why take bus div is hidden
        self.assertEqual(attribute_value, "display: none;")

    def test_modal_display(self):

        # user navigates to homepage
        self.driver.get("http://127.0.0.1:8000/");
        self.driver.maximize_window()

        # user clicks modal box button
        plan_button = self.driver.find_element_by_id('planButton')
        plan_button.click()

        # give time for DOM to execute
        time.sleep(1)

        #retrieving modal element
        element = self.driver.find_element_by_id("exampleModal")
        attribute_value = element.get_attribute("style")



        #checking modal box is displayed
        self.assertIn("block", attribute_value)

#     # def test_modal_display(self):
#     #
#     #     response = webdriver.request('POST', 'http://127.0.0.1:8000/')
#     #     print(response)
#     # def test_modal_displays_on_click(self):
#     #     self.browser.get(self.live_server_url)
#     #
#     #     # User arrives on page for first time
#     #     self.browser.find_element_by_id("planButton").click()
#     #
#     #
#     # def test_github_redirects(self):
#     #     self.browser.get(self.live_server_url)
#     #
#     #     # User arrives on page for first time
#     #     self.browser.find_element_by_id("planButton").click()
