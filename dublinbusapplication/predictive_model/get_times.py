from bisect import bisect_left


def get_time_list(full_forecast):
    """creates a list of times available in the current and 5 day forecast"""
    time_list = []
    for item in full_forecast:
        time_list.append(item['date_time'])
    return time_list


def nearest(ts, s):
    """finds the nearest time to the one inputted using a bisect method"""

    # Given a presorted list of timestamps:  s = sorted(index)
    i = bisect_left(s, ts)
    return min(s[max(0, i - 1): i + 2], key=lambda t: abs(ts - t))


def get_time(full_forecast, nearest):
    """returns the datetime of the nearest forecast to the users input"""
    for date_time in full_forecast:
        if date_time['date_time'] == nearest:
            return date_time
