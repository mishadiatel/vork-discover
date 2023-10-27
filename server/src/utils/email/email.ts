import nodemailer from 'nodemailer';
import {htmlToText} from 'html-to-text';
import {UserDocument} from '../../models/userModel';
import {emailhtml} from './emailhtml';

export default class Email {
    private to: string;
    private firstName: string;
    private from: string;
    private url: string;

    constructor(user: UserDocument, url: string) {
        this.to = user.email;
        this.firstName = user.firstName;
        this.from = `Work-diskover <${process.env.EMAIL_FROM}>`;
        this.url = url;
    }

    private newTransport() {
        return nodemailer.createTransport({
            host: process.env.EMAIL_REALSEND_HOST,
            port: parseInt(process.env.EMAIL_REALSEND_PORT || '587'), // Provide a default value or handle it appropriately
            auth: {
                user: process.env.EMAIL_FROM,
                pass: process.env.EMAIL_REALSEND_PASSWORD
            }
        });
    }

    async send(template: string, subject: string, mainText: string) {
        const replacedHtml = emailhtml.replace('{TITLE}', `${this.firstName} ${subject}`)
        .replace('{LINK}', this.url)
        .replace('{MAIN_TEXT}', mainText);
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text: htmlToText(replacedHtml),
            html: replacedHtml
        };
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours Family!',
            'Your account was successfully created');
    }

    async sendPasswordReset() {
        await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)', '');
    }
}
