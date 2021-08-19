from selenium import webdriver
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from django.urls import reverse
import time


class TestIndexPage(StaticLiveServerTestCase):

    def setUp(self):
        self.driver = webdriver.Chrome(
            "C:/Users/matth/Desktop/Summer/Project code/dublin_busboys/functional_tests/chromedriver.exe")

    def tearDown(self):
        self.driver.quit()

    def test_submit_contact_form(self):
        # user navigates to contact page
        self.driver.get("http://127.0.0.1:8000/contact/")
        self.driver.maximize_window()

        #user inputs in all fields
        email_input = self.driver.find_element_by_name("username")
        email_input.send_keys("testUserEmail@testUser.com")

        comment_input = self.driver.find_element_by_name("username")
        comment_input.send_keys("""Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tincidunt lectus 
        magna, ut lobortis orci varius quis. Morbi metus erat, ornare at venenatis id, tincidunt quis arcu. Morbi 
        vitae erat sed mauris tempus rhoncus. Cras hendrerit libero sapien, eget ultricies enim finibus in. Cras ut 
        justo in mi gravida ullamcorper et id ligula. Aenean at placerat turpis, et feugiat tortor. """)

        #user submits form
        submit = self.driver.find_element_by_class_name("btn")
        submit.click()

        time.sleep(5)

        #comment box should be empty on successful subission
        comment_input = self.driver.find_element_by_name("username")
        self.assertEquals(comment_input, "metrics")
