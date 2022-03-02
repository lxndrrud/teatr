import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
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
    message = MIMEMultipart('alternative')
    message["Subject"] = "Бронь в театре на Оборонной"
    message["From"] = mail_config["login"]
    message["To"] =  email
    custom_text = f"""
    Код подтверждения вашей брони: {confirmation_code}
    Код идентификации вашей брони (понадобится на кассе и при управлении бронью): {code}
    Название представления: {play_title}
    Дата и время представления: {datetime}
    Название зала: {auditorium_title}
    """
    text_part = MIMEText(custom_text, 'plain')
    message.attach(text_part)
    with smtplib.SMTP_SSL(mail_config["server"], mail_config["port"], context=context) as server:
        server.login(mail_config["login"], mail_config["password"])
        server.sendmail(mail_config["login"], email, message.as_string())

def formatStrFromDatetime(date_: date, time_: time):
    """
    datetime str format: "dd-mm-yyyy hh:mm"
    """
    return f"{date_.day}-{date_.month}-{date_.year} {time_.hour}:{time_.minute}"


def generate_code() -> str:
    seed()
    return f'{randint(0, 9)}{randint(0, 9)}{randint(0, 9)}{randint(0, 9)}{randint(0, 9)}{randint(0, 9)}'