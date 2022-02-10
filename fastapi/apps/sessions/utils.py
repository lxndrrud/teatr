from datetime import datetime

def formatDatetime(input_):
    """
    datetime csv format: "dd-mm-yyyy hh:mm"
    """
    datetime_content = input_.split(' ')
    date = datetime_content[0].split("-")
    time = datetime_content[1].split(":")
    return datetime(year=int(date[2]), month=int(date[1]), day=int(date[0]), hour=int(time[0]), minute=int(time[1]))
