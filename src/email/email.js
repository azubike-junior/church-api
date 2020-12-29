import sgMail from '@sendgrid/mail';
import config from '../config/config';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(config.sgKey)

const sendEmail = async (email, subject, html) => {
    const emailBody = {
        from: config.fromEmail,
        to: email,
        subject,
        html
    }
    return await sgMail.send(emailBody)
}

export default sendEmail