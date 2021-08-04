import pandas as pd
import pickle
import os
import json
from math import cos, asin, sqrt

# added in this filePath method to find the right path to the pkl files because it couldn't find them before
def filePath(filename):
    modulePath = os.path.dirname(__file__)  # get current directory
    filePath = os.path.join(modulePath, filename)
    return filePath


# start_stop_id = 608
# end_stop_id = 114
# temp = 6
# weather_main = 'Rain'

# currently the route and stops sequence dictionary are hard coded
# but these will be retrieved from the google response and a static JSON file

f = open(filePath('Full_stops_sequence_merged.json'))
stops_sequence = json.load(f)

def get_route(stops_sequence, bus_route):
    route_dict = {}
    for i in range(0, 2):

        if (bus_route + "_{}".format(i)) in stops_sequence:

            sequence = stops_sequence[bus_route + "_{}".format(i)]
            route_dict['d{}'.format(i)] = {}
            route_dict['d{}'.format(i)] = sequence

        else:
            pass

    return route_dict


def peak_hour(hour):
    if (7 < hour < 10) or (16 < hour < 19):
        peak = 1
    else:
        peak = 0

    return peak


def direction(start, end, stops):

    """ deciphers which direction the journey is taking place and returns the relevant key
    such that the dictionary can be accessed """

    for key, value in stops.items():
        if start in value and end in value:
            return key


def distance(lat1, lon1, lat2, lon2):
    p = 0.017453292519943295
    hav = 0.5 - cos((lat2-lat1)*p)/2 + cos(lat1*p)*cos(lat2*p) * (1-cos((lon2-lon1)*p)) / 2
    return 12742 * asin(sqrt(hav))



def closest(data, v):
    return min(data, key=lambda p: distance(v['lat'],v['lon'],p['lat'],p['lon']))



def prediction(route, hour, day, month, start_stop_id, end_stop_id, wind_speed, temp, humidity, weather_main,
               stops):

    journey_stops = stops[direction(start_stop_id, end_stop_id, stops)]
    stop_sequence = journey_stops[journey_stops.index(start_stop_id):journey_stops.index(end_stop_id) + 1]

    print(stop_sequence)
    prediction_df = pd.DataFrame(stop_sequence, columns=['STOPPOINTID'])
    prediction_df['NEXT_STOPPOINTID'] = prediction_df['STOPPOINTID'].shift(-1)
    prediction_df = prediction_df.dropna(axis=0)
    prediction_df['NEXT_STOPPOINTID'] = prediction_df['NEXT_STOPPOINTID'].astype('int')

    df = pd.DataFrame(columns=['DAY', 'HOUR', 'MONTH', 'PEAK_HOUR', 'wind_speed', 'temp', 'humidity', 'weather_main'])

    user_input = [day, hour, month, peak_hour(hour), wind_speed, temp, humidity, weather_main]

    df.loc[0] = user_input

    frames = [prediction_df, df]
    result = pd.concat(frames, axis=1).ffill()

    result['STOPPOINTID'] = result['STOPPOINTID'].astype('category')
    result['NEXT_STOPPOINTID'] = result['NEXT_STOPPOINTID'].astype('category')
    result['DAY'] = result['DAY'].astype('category')
    result['HOUR'] = result['HOUR'].astype('category')
    result['MONTH'] = result['MONTH'].astype('category')
    result['PEAK_HOUR'] = result['PEAK_HOUR'].astype('int')
    result['wind_speed'] = result['wind_speed'].astype('float')
    result['temp'] = result['temp'].astype('int')
    result['humidity'] = result['humidity'].astype('float')
    result['weather_main'] = result['weather_main'].astype('category')

    df_dummies = pd.get_dummies(result)

    with open(filePath('LinRegPickles/LinReg_route_{}_headers.pkl'.format(route)), 'rb') as handle:
        dummies = pickle.load(handle)
    full_dummies = pd.DataFrame(columns=dummies)

    df_a, df_b = full_dummies.align(df_dummies, fill_value=0)

    final_df_for_predict = df_b.reindex(full_dummies.columns, axis=1)

    with open(filePath('LinRegPickles/LinReg_Model_route_{}.pkl'.format(route)), 'rb') as handle:
        model = pickle.load(handle)

    y_pred_linear = model.predict(final_df_for_predict)

    # remove any predictions that are way off due to the new stop sequence data being used
    # take the average journey time between all other stops and replace the incorrect prediction with this value

    good_array = [item for item in y_pred_linear if item < 400 and item > 0]
    average = sum(good_array) / len(good_array)
    good_pred = [average if test > 400 or test < 0 else test for test in y_pred_linear]

    final_prediction = sum(good_pred) / 60

    return final_prediction
