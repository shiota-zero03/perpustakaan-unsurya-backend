import nodemailer, { Transporter } from 'nodemailer';

export const sendEmail = async (to: string, subject: string, html: string) => {
    const transporter: Transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SMTP_HOST || 'sandbox.smtp.mailtrap.io',
        port: parseInt(process.env.EMAIL_SMTP_PORT || '2525'),
        auth: {
            user: process.env.EMAIL_SMTP_USER,
            pass: process.env.EMAIL_SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_SMTP_FROM,
        to,
        subject,
        html,
    });
};
