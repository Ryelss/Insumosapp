import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import * as XLSX from 'xlsx';

export async function POST(request: Request) {
  try {
    // Recibimos el correoSolicitante desde el frontend
    const { establecimiento, correoSolicitante, detalles } = await request.json();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, 
      auth: {
        user: "admin@educasanantonio.cl", // Correo que enviará el mensaje
        pass: "gyrttgfaexvzmitn", // NO es la clave normal, es la "App Password"
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const listaHtml = detalles.map((item: any) =>
      `<li style="margin-bottom: 5px;">
        <strong>${item.cantidadCarrito}x</strong> ${item.nombre_producto} 
        <span style="color: #666; font-size: 12px;">(${item.marca})</span>
       </li>`
    ).join('');

    // NUEVO: Agregamos el "Correo Solicitante" a las columnas del Excel
    const datosExcel = detalles.map((item: any) => ({
      'Establecimiento': establecimiento,
      'Correo Solicitante': correoSolicitante,
      'Insumo': item.nombre_producto,
      'Marca': item.marca || 'Genérico',
      'Tipo': item.tipo || 'N/A',
      'Cantidad Solicitada': item.cantidadCarrito
    }));

    const worksheet = XLSX.utils.json_to_sheet(datosExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Detalle Insumos");
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const mailOptions = {
      from: '"Plataforma Insumos DAEM" <TU_CORREO_DE_SISTEMAS@gmail.com>',
      to: "admin@educasanantonio.cl",
      subject: `🚨 Nuevo Pedido - ${establecimiento}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #005EAD;">Nuevo pedido de insumos ingresado</h2>
          <p style="font-size: 16px;">El establecimiento <strong>${establecimiento}</strong> acaba de realizar una solicitud a través de la plataforma.</p>
          
          <div style="background-color: #f9f9f9; padding: 10px; border-left: 4px solid #F09B1A; margin-bottom: 20px;">
            <p style="margin: 0;"><strong>Usuario Responsable:</strong> <a href="mailto:${correoSolicitante}">${correoSolicitante}</a></p>
          </div>
          
          <h3 style="border-bottom: 2px solid #6EAF26; padding-bottom: 5px;">Detalle del pedido:</h3>
          <ul>
            ${listaHtml}
          </ul>
          
          <p style="margin-top: 20px; font-weight: bold; color: #333;">
            📎 Se ha adjuntado un archivo Excel con el detalle y la trazabilidad de esta solicitud.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `Pedido_${establecimiento.replace(/\s+/g, '_')}.xlsx`,
          content: excelBuffer 
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error enviando correo:", error);
    return NextResponse.json({ error: 'Error interno enviando correo' }, { status: 500 });
  }
}