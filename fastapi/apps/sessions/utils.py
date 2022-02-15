from datetime import datetime

def formatDate(input_):
    """
    date csv format: "dd-mm-yyyy"
    """
    date = input_.split("-")
    return datetime(year=int(date[2]), month=int(date[1]), day=int(date[0]))


def formatTime(input_):
    """
    time csv format: "hh:mm"
    """
    time = input_.split(":")
    return datetime(hour=int(time[0]), minute=int(time[1]))
