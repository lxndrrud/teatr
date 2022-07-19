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

    public sendMail(email: string, confirmation_code: string,
        id_reservation: number, play_title: string, timestamp: string, 
        auditorium_title: string) {
        
        return this.transporter.sendMail({
            from: `"Театр на Оборонной" <${process.env.MAIL_USER}@yandex.ru>`,
            to: email,
            subject: "Бронь в театре на Оборонной",
            text: 
            `Номер вашей брони (понадобится на кассе): ${id_reservation.toString()}\n` +
            `Код подтверждения вашей брони: ${confirmation_code}\n` +
            `Название представления: ${play_title}\n` +
            `Дата и время представления: ${timestamp}\n` +
            `Название зала: ${auditorium_title}\n`,
        });
    }
}
