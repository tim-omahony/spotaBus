from bisect import bisect_left

def get_time_list(full_forecast):
    time_list = []
    for item in full_forecast:
        time_list.append(item['date_time'])
    return time_list

#finds the nearest time to the one inputted using a bisect method
def nearest(ts, s):
    # Given a presorted list of timestamps:  s = sorted(index)
    i = bisect_left(s, ts)
    return min(s[max(0, i-1): i+2], key=lambda t: abs(ts - t))

def get_time(full_forecast, nearest):
    for date_time in full_forecast:
        if date_time['date_time'] == nearest:
            return date_time
