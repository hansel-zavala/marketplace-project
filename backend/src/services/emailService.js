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

module.exports = {
    sendResetCode
};