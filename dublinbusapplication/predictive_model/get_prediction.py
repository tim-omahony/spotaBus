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
stops = [1730, 1731, 1732, 1733, 1650, 1652, 5141, 1773, 1774, 1651, 4784, 608, 4791, 4792, 1196,
         1197, 4473, 250, 251, 4597, 255, 218, 219, 220, 221, 222, 223, 224, 225, 226, 114, 1645, 1646, 7571]


def prediction(hour, day, month, start_stop_id, end_stop_id, temp, weather_main, stops):
    journey_stops = stops[stops.index(start_stop_id):stops.index(end_stop_id) + 1]

    prediction_df = pd.DataFrame(journey_stops, columns=['STOPPOINTID'])
    prediction_df['NEXT_STOPPOINTID'] = prediction_df['STOPPOINTID'].shift(-1)
    prediction_df = prediction_df.dropna(axis=0)
    prediction_df['NEXT_STOPPOINTID'] = prediction_df['NEXT_STOPPOINTID'].astype('int')

    df = pd.DataFrame(columns=['DAY', 'HOUR', 'MONTH', 'temp', 'weather_main'])
    user_input = [day, hour, month, temp, weather_main]
    df.loc[0] = user_input

    frames = [prediction_df, df]
    result = pd.concat(frames, axis=1).ffill()

    result['STOPPOINTID'] = result['STOPPOINTID'].astype('category')
    result['NEXT_STOPPOINTID'] = result['NEXT_STOPPOINTID'].astype('category')
    result['DAY'] = result['DAY'].astype('category')
    result['HOUR'] = result['HOUR'].astype('category')
    result['MONTH'] = result['MONTH'].astype('category')
    result['temp'] = result['temp'].astype('int')
    result['weather_main'] = result['weather_main'].astype('category')

    df_dummies = pd.get_dummies(result)

    with open(filePath('Test_dummies_Model_route_104.pkl'), 'rb') as handle:
        dummies = pickle.load(handle)
    full_dummies = pd.DataFrame(columns=dummies)

    df_a, df_b = full_dummies.align(df_dummies, fill_value=0)

    final_df_for_predict = df_b.reindex(full_dummies.columns, axis=1)

    with open(filePath('Test_Model_route_104.pkl'), 'rb') as handle:
        model = pickle.load(handle)

    y_pred_linear = model.predict(final_df_for_predict)

    final_prediction = sum(y_pred_linear) / 60

    return final_prediction
