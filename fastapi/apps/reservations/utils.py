import smtplib, ssl
from random import seed, randint

mail_config = {
    "server": "smtp.gmail.com",
    "login": "for.mailing.shop@gmail.com",
    "password": "MaiL123454!",
    "port": 465
}

def send_confirmation_email(email: str, code: str) -> None:
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(mail_config["server"], mail_config["port"], context=context) as server:
        server.login(mail_config["login"], mail_config["password"])
        BODY = "\r\n".join((
            "From: %s" % mail_config["login"],
            "To: %s" % email,
            "Subject: Бронь в театре на Оборонной",
            "",
            "Код вашей брони в театре на Оборонной: %s" % code
        )).encode()
        server.sendmail(mail_config["login"], email, BODY)


def generate_code() -> str:
    seed()
    return f'{randint(0, 9)}{randint(0, 9)}{randint(0, 9)}{randint(0, 9)}{randint(0, 9)}{randint(0, 9)}'