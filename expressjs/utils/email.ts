import nodemailer from "nodemailer"
import 'dotenv/config'

export class EmailSender {
    private transporter
    private HOST
    private PORT

    constructor() {
        this.HOST = process.env.MAIL_HOST || ""
        this.PORT = process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT) : 0
        this.transporter = nodemailer.createTransport({
            host: this.HOST,
            port: this.PORT,
            secure: true,
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASSWORD
            }
        });
    }

    public async send(toEmail: string, subject: string, text: string) {
        return this.transporter.sendMail({
            from: `"Театр на Оборонной" <${process.env.MAIL_USER}@yandex.ru>`,
            to: toEmail,
            subject: subject,
            text: text
        });
    }
}
