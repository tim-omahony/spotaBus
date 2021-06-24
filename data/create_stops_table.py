from scraper.weather.db_session import Session, engine
from db_details import *
import pandas as pd

session = Session()

df = pd.read_csv("stops.csv", sep=',', quotechar='\'', encoding='utf8')
df.to_sql('stops', con=engine, index=False, if_exists='append')
