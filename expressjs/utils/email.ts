import { extendedTimestamp } from "./timestamp";
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'for.mailing.shop@gmail.com',
      pass: 'MaiL123454!'
    }
});

export const sendMail = (email: string, confirmation_code: string,
    id_reservation: number, play_title: string, timestamp: string, 
    auditorium_title: string) => {
    return transporter.sendMail({
        from: '"Театр на Оборонной" <for.mailing.shop@gmail.com>',
        to: email,
        subject: "Бронь в театре на Оборонной",
        text: 
        `Номер вашей брони (понадобится на кассе): ${id_reservation.toString()}\n` +
        `Код подтверждения вашей брони: ${confirmation_code}\n` +
        `Название представления: ${play_title}\n` +
        `Дата и время представления: ${extendedTimestamp(timestamp)}\n` +
        `Название зала: ${auditorium_title}\n`,
    });
}