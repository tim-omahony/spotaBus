import pandas as pd
import pickle
import os


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

route = 104
stops_dict = {'d1': [1730, 1731, 1732, 1733, 1650, 1652, 5141, 1773, 1774, 1651, 4784, 608, 4791, 4792, 1196,
                     1197, 4473, 250, 251, 4597, 255, 218, 219, 220, 221, 222, 223, 224, 225, 226, 114, 1645, 1646,
                     7571],
              'd2': [7571, 1644, 1605, 228, 229, 227, 230, 231, 232, 233, 242, 243, 253, 245, 4474, 4790, 1220, 1221,
                     674,
                     4389, 4390, 530, 4785, 1764, 1765, 1766, 1767, 7129, 1744, 1745, 1746, 1747, 1748, 1749]}


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

    final_prediction = sum(y_pred_linear) / 60

    return final_prediction
