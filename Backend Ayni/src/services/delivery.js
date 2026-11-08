import nodemailer from 'nodemailer';
import '../config.js';
export const mailReady = () =>
  !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD &&
    process.env.MAIL_FROM &&
    process.env.FRONTEND_URL
  );
export const smsReady = () =>
  !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM
  );
export async function sendResetEmail(email, link) {
  const secure = process.env.SMTP_SECURE === 'true';
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure,
    requireTLS: !secure,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    connectionTimeout: 10000,
    socketTimeout: 15000,
  });
  try {
    return await transport.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: 'Recupera tu acceso a Ayni',
      text: `Recibimos una solicitud para cambiar tu contraseña de Ayni.\n\n${link}\n\nEste enlace caduca en 15 minutos y solo funciona una vez. Si no lo solicitaste, ignora este correo.`,
    });
  } finally {
    transport.close();
  }
}
export async function sendSms(to, body) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(`${sid}:${process.env.TWILIO_AUTH_TOKEN}`).toString(
            'base64',
          ),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: to,
        From: process.env.TWILIO_FROM,
        Body: body,
      }),
      signal: AbortSignal.timeout(15000),
    },
  );
  const result = await response.json();
  if (!response.ok) throw new Error('El proveedor SMS rechazó el envío.');
  return { id: result.sid, status: result.status || 'queued' };
}
