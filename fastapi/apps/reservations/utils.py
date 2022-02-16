import smtplib, ssl
from random import seed, randint
from datetime import date, time

mail_config = {
    "server": "smtp.gmail.com",
    "login": "for.mailing.shop@gmail.com",
    "password": "MaiL123454!",
    "port": 465
}

def send_confirmation_email(email: str, confirmation_code: str, code: str, \
    play_title: str, datetime: str, auditorium_title) -> None:
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(mail_config["server"], mail_config["port"], context=context) as server:
        server.login(mail_config["login"], mail_config["password"])
        BODY = "\r\n".join((
            "From: %s" % mail_config["login"],
            "To: %s" % email,
            "Subject: Бронь в театре на Оборонной",
            "",
            "Код подтверждения вашей брони в театре на Оборонной: %s" % confirmation_code,
            "Код идентификации вашей брони в театре на Оборонной (понадобится на кассе): %s" % code,
            "Название представления: %s" % play_title,
            "Дата и время представления: %s" % datetime,
            "Название зала: %s" % auditorium_title
        )).encode()
        server.sendmail(mail_config["login"], email, BODY)

def formatStrFromDatetime(date_: date, time_: time):
    """
    datetime str format: "dd-mm-yyyy hh:mm"
    """
    return f"{date_.day}-{date_.month}-{date_.year} {time_.hour}:{time_.minute}"


def generate_code() -> str:
    seed()
    return f'{randint(0, 9)}{randint(0, 9)}{randint(0, 9)}{randint(0, 9)}{randint(0, 9)}{randint(0, 9)}'