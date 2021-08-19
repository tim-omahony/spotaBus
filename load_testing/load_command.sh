

#Load testing with up to a thousand concurrent users
locust -f locust.py --host http://localhost:8000/-users 1000 --spawn-rate 30
locust -f locust.py --host http://localhost:8000/about -users 1000 --spawn-rate 30
locust -f locust.py --host http://localhost:8000/contact -users 1000 --spawn-rate 30
locust -f locust.py --host http://localhost:8000 -users 1000 --spawn-rate 30

#Spike testing with up to a thousand concurrent users
locust -f locust.py --host http://localhost:8000/-users 1000 --spawn-rate 200
locust -f locust.py --host http://localhost:8000/about -users 1000 --spawn-rate 200
locust -f locust.py --host http://localhost:8000/contact -users 1000 --spawn-rate 200
locust -f locust.py --host http://localhost:8000 -users 1000 --spawn-rate 200