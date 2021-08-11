import pandas as pd
import pickle
import os
import json
from math import cos, asin, sqrt


# filePath method to find the right path to the pkl files because it couldn't find them before
def filePath(filename):
    modulePath = os.path.dirname(__file__)  # get current directory
    filePath = os.path.join(modulePath, filename)
    return filePath


# reading in the JSON file with all stop sequences
f = open(filePath('Full_stops_sequence_merged.json'))
stops_sequence = json.load(f)


def get_route(stops_sequence, bus_route):
    """ This function takes in the stop sequence JSON and the bus route number and deciphers which direction
    of the route the user has chosen by matching the key with a string we create"""
    route_dict = {}
    for i in range(0, 2):

        if (bus_route + "_{}".format(i)) in stops_sequence:
            sequence = stops_sequence[bus_route + "_{}".format(i)]
            route_dict['d{}'.format(i + 1)] = {}
            route_dict['d{}'.format(i + 1)] = sequence

        else:
            pass

    return route_dict


def peak_hour(hour):
    """ this function takes in the hour and returns an indicator variable whether or not it is the peak hour
    1 for peak and 0 for off peak """
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
    """ given two sets of latitude and longitude coordinates, this function determines the distance
     between them using the Haversine formula"""
    p = 0.017453292519943295
    hav = 0.5 - cos((lat2 - lat1) * p) / 2 + cos(lat1 * p) * cos(lat2 * p) * (1 - cos((lon2 - lon1) * p)) / 2
    return 12742 * asin(sqrt(hav))


def closest(data, v):
    '''given a list of dictionaries containing latitude and longitude coordiantes and a specific set of coordinates (v),
    this function will find the closest coordinates using the haversine formula above'''
    return min(data, key=lambda p: distance(v['lat'], v['lon'], p['lat'], p['lon']))


def prediction(route, hour, day, month, start_stop_id, end_stop_id, wind_speed, temp, humidity, weather_main,
               stops):
    """ this is the main prediction function which takes in the parameters of the machine learning model and returns an
    estimated jourey time in seconds """

    dir = direction(start_stop_id, end_stop_id, stops)

    print(dir)

    # a list of journey stops is retrieved for the chosen route using the JSON file and the directions function
    journey_stops = stops[direction(start_stop_id, end_stop_id, stops)]

    # the specific stop sequence between the stops chosen by the user is retrieved by taking the index of the
    # start stop id and the end stop id and getting a list of the stops in between
    stop_sequence = journey_stops[journey_stops.index(start_stop_id):journey_stops.index(end_stop_id) + 1]

    print(stop_sequence)

    # a dataframe is created with the stop IDs and the next stop ID, creating a dataframe of stop-wise pairs
    prediction_df = pd.DataFrame(stop_sequence, columns=['STOPPOINTID'])
    prediction_df['NEXT_STOPPOINTID'] = prediction_df['STOPPOINTID'].shift(-1)
    prediction_df = prediction_df.dropna(axis=0)
    prediction_df['NEXT_STOPPOINTID'] = prediction_df['NEXT_STOPPOINTID'].astype('int')

    # dataframe with the specific headers is created and the parameters are filled with the input from the post request
    df = pd.DataFrame(columns=['DAY', 'HOUR', 'MONTH', 'PEAK_HOUR', 'wind_speed', 'temp', 'humidity', 'weather_main'])
    user_input = [day, hour, month, peak_hour(hour), wind_speed, temp, humidity, weather_main]
    df.loc[0] = user_input

    # concatenating the stop ID dataframe and user input dataframe, filling the empty entries with the user input
    frames = [prediction_df, df]
    result = pd.concat(frames, axis=1).ffill()

    # converting features to correct data types
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

    # retrieving the dummy variables for this dataframe
    df_dummies = pd.get_dummies(result)

    try:

        # retrieving the dummy headers that were created on creation of the specific model
        with open(filePath('Final_LR_DT_Pickles/LinReg_route__{}_{}_headers.pkl'.format(route, dir)), 'rb') as handle:
            dummies = pickle.load(handle)

    except (OSError, IOError) as e:

        # retrieving the dummy headers that were created on creation of the specific model
        with open(filePath('Final_LR_DT_Pickles/DecisionTree_route_{}_{}_headers.pkl'.format(route, dir)), 'rb') as handle:
            dummies = pickle.load(handle)

    # creating a dataframe with these headers
    # aligning the two dataframes on their axes and filling all empty entries with zeros
    # reindexing the dataframe with the index that is expected by the machine learning model
    full_dummies = pd.DataFrame(columns=dummies)
    df_a, df_b = full_dummies.align(df_dummies, fill_value=0)
    final_df_for_predict = df_b.reindex(full_dummies.columns, axis=1)

    try:
        # opening the specific pickle file in order to make the prediction
        with open(filePath('Final_LR_DT_Pickles/LinReg_Model_route_{}_{}.pkl'.format(route, dir)), 'rb') as handle:
            model = pickle.load(handle)

    except (OSError, IOError):

        # opening the specific pickle file in order to make the prediction
        with open(filePath('Final_LR_DT_Pickles/DecisionTree_Model_route_{}_{}.pkl'.format(route, dir)), 'rb') as handle:
            model = pickle.load(handle)

    # making the final prediction
    y_pred_linear = model.predict(final_df_for_predict)

    # remove any predictions that are way off due to the new stop sequence data being used
    # take the average journey time between all other stops and replace the incorrect prediction with this value
    good_array = [item for item in y_pred_linear if item < 400 and item > 0]
    average = sum(good_array) / len(good_array)
    good_pred = [average if test > 400 or test < 0 else test for test in y_pred_linear]

    # getting the summation of the final array
    final_prediction = sum(good_pred)

    # returning the result
    return final_prediction
