import { extendedTimestamp } from "./timestamp";
import nodemailer from "nodemailer"
import 'dotenv/config'


const HOST = process.env.MAIL_HOST || ""
const PORT = process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT) : 0

const transporter = nodemailer.createTransport({
    host: HOST,
    port: PORT,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
});

export const sendMail = (email: string, confirmation_code: string,
    id_reservation: number, play_title: string, timestamp: string, 
    auditorium_title: string) => {
    
    return transporter.sendMail({
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