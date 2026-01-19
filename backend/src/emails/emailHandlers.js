import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from '../emails/emailTemplates.js';

export const sendWelcomeEmail = async (email, name, clientURL) => {
    if (!sender?.email || !sender?.name) {
        throw new Error('Email sender configuration is missing (EMAIL_FROM and EMAIL_FROM_NAME)');
    }
    if(!email) throw new Error('Recipient email is required to send welcome email');
    if(!name) throw new Error('Recipient name is required to send welcome email');
        
    const { data, error } = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: 'Welcome to Chatify!',
        html: createWelcomeEmailTemplate(name, clientURL)
    });

    if (error) {
        console.error('Error sending welcome email:', error);
        throw new Error('Failed to send welcome email');
    }

    console.log('Welcome email sent successfully:', data);
}