import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { establecimiento, detalles } = await request.json();

    // 1. Configuramos el acceso al servidor de correos (SMTP)
    // Como eres Encargado TI del DAEM, asumo que usan Google Workspace o similar.
    // Necesitarás reemplazar esto con las credenciales SMTP de tu institución.
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // Cambiamos de 465 a 587
      secure: false, // Falso para que use STARTTLS en lugar de SSL directo
      auth: {
        user: "admin@educasanantonio.cl", // Correo que enviará el mensaje
        pass: "gyrttgfaexvzmitn", // NO es la clave normal, es la "App Password"
      },
      tls: {
        rejectUnauthorized: false // Evita problemas con certificados en redes institucionales
      }
    });

    // 2. Armamos la lista de insumos en formato HTML para que el correo se vea bonito
    const listaHtml = detalles.map((item: any) =>
      `<li style="margin-bottom: 5px;">
        <strong>${item.cantidadCarrito}x</strong> ${item.nombre_producto} 
        <span style="color: #666; font-size: 12px;">(${item.marca})</span>
       </li>`
    ).join('');

    // 3. Estructuramos el correo que le llegará a admin@educasanantonio.cl
    const mailOptions = {
      from: '"Plataforma Insumos DAEM" <TU_CORREO_DE_SISTEMAS@gmail.com>',
      to: "admin@educasanantonio.cl",
      subject: `🚨 Nuevo Pedido de Insumos - ${establecimiento}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #005EAD;">Nuevo pedido de insumos ingresado</h2>
          <p style="font-size: 16px;">El establecimiento <strong>${establecimiento}</strong> acaba de realizar una solicitud a través de la plataforma.</p>
          
          <h3 style="border-bottom: 2px solid #6EAF26; padding-bottom: 5px;">Detalle del pedido:</h3>
          <ul>
            ${listaHtml}
          </ul>
          
          <p style="color: #888; font-size: 12px; margin-top: 30px;">
            Este es un correo automático generado por la Plataforma de Suministros DAEM San Antonio.
          </p>
        </div>
      `,
    };

    // 4. Ejecutamos el envío
    await transporter.sendMail(mailOptions);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error enviando correo:", error);
    return NextResponse.json({ error: 'Error interno enviando correo' }, { status: 500 });
  }
}