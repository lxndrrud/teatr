import smtplib, ssl

mail_config = {
    "server": "smtp.gmail.com",
    "login": "for.mailing.shop@gmail.com",
    "password": "MaiL123454!",
    "port": 465
}

def send_confirmation_email(email: str, code):
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(mail_config["server"], mail_config["port"], context=context) as server:
        server.login(mail_config["login"], mail_config["password"])
        server.sendmail(mail_config["login"], email, f"Код вашей брони в театре на Оборонной: {code}")