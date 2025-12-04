// backend/src/services/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendResetCode = async (email, code) => {
    const mailOptions = {
        from: `"Soporte Marketplace" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Código de recuperación de contraseña',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #2563eb;">Restablecer Contraseña</h2>
                <p>Has solicitado restablecer tu contraseña. Usa el siguiente código:</p>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1f2937;">${code}</span>
                </div>
                <p>Este código expira en 15 minutos.</p>
                <p style="font-size: 12px; color: #666;">Si no solicitaste esto, ignora este correo.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error enviando email:', error);
        return false;
    }
};

const sendContactEmail = async (toEmail, proName, clientData) => {
    const { name, email, phone, message } = clientData;
    
    const mailOptions = {
        from: `"Marketplace Notificaciones" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        replyTo: email,
        subject: `Nuevo mensaje de ${name} - Solicitud de Servicio`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #2563eb; padding: 20px; text-align: center; color: white;">
                    <h2 style="margin: 0;">¡Tienes un nuevo cliente potencial!</h2>
                </div>
                <div style="padding: 30px; background-color: #ffffff;">
                    <p>Hola <strong>${proName}</strong>,</p>
                    <p>${name} está interesado en tus servicios y te ha enviado el siguiente mensaje:</p>
                    
                    <div style="background-color: #f9fafb; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0; font-style: italic; color: #555;">
                        "${message}"
                    </div>

                    <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Datos de Contacto</h3>
                    <p><strong>Nombre:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
                    <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>

                    <div style="text-align: center; margin-top: 30px;">
                        <a href="mailto:${email}" style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Responder por Correo</a>
                    </div>
                </div>
                <div style="background-color: #f3f4f6; padding: 15px; text-align: center; color: #888; font-size: 12px;">
                    <p>Este mensaje fue enviado a través de tu perfil en Marketplace.</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error enviando email de contacto:', error);
        return false;
    }
};

module.exports = {
    sendResetCode,
    sendContactEmail
};