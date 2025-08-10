/* eslint-disable @typescript-eslint/no-unused-vars */
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface TicketData {
  id: string;
  qrCode: string;
  ticketType: {
    name: string;
    price: number;
  };
}

export interface EmailTicketData {
  purchaseId: string;
  buyerEmail: string;
  buyerName: string;
  event: {
    name: string;
    date: string;
    time: string;
    location: string;
    city: string;
  };
  tickets: TicketData[];
  totalAmount: number;
}

export class EmailService {
  static async sendTickets(data: EmailTicketData): Promise<boolean> {
    try {
      console.log("[EMAIL_SERVICE] Sending tickets to:", data.buyerEmail);

      // Generar HTML del email
      const emailHtml = await this.generateTicketEmailHtml(data);

      // Generar PDF adjunto
      const pdfBuffer = await this.generateTicketPDF(data);

      const { data: result, error } = await resend.emails.send({
        from: `${process.env.FROM_NAME || "Carbono Tickets"} <${
          process.env.FROM_EMAIL || "onboarding@resend.dev"
        }>`,
        to: [data.buyerEmail],
        subject: `🎫 Tus entradas para ${data.event.name}`,
        html: emailHtml,
        attachments: [
          {
            filename: `tickets-${data.purchaseId}.pdf`,
            content: pdfBuffer,
          },
        ],
      });

      if (error) {
        console.error("[EMAIL_SERVICE] Error sending email:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("[EMAIL_SERVICE] Unexpected error:", error);
      return false;
    }
  }

  private static async generateTicketEmailHtml(
    data: EmailTicketData
  ): Promise<string> {
    const { event, tickets, buyerName, totalAmount } = data;

    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tus Entradas - ${event.name}</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
            }
            .container {
                background: white;
                border-radius: 12px;
                padding: 32px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 32px;
                border-bottom: 2px solid #fbbf24;
                padding-bottom: 16px;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                color: #0a0a0a;
                margin-bottom: 8px;
            }
            .logo .highlight {
                color: #fbbf24;
            }
            .event-info {
                background: #fbbf24;
                color: #0a0a0a;
                padding: 20px;
                border-radius: 8px;
                margin: 24px 0;
                text-align: center;
            }
            .event-name {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 8px;
            }
            .event-details {
                font-size: 16px;
                opacity: 0.9;
            }
            .tickets-section {
                margin: 24px 0;
            }
            .ticket {
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                padding: 16px;
                margin: 12px 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .ticket-info {
                flex: 1;
            }
            .ticket-type {
                font-weight: bold;
                font-size: 16px;
                color: #0a0a0a;
            }
            .ticket-code {
                font-family: monospace;
                font-size: 12px;
                color: #6b7280;
                margin-top: 4px;
            }
            .ticket-price {
                font-weight: bold;
                color: #fbbf24;
                font-size: 18px;
            }
            .total {
                background: #f3f4f6;
                padding: 16px;
                border-radius: 8px;
                text-align: center;
                margin: 24px 0;
            }
            .total-amount {
                font-size: 24px;
                font-weight: bold;
                color: #0a0a0a;
            }
            .instructions {
                background: #eff6ff;
                border: 1px solid #bfdbfe;
                border-radius: 8px;
                padding: 16px;
                margin: 24px 0;
            }
            .instructions h3 {
                color: #1e40af;
                margin-top: 0;
            }
            .footer {
                text-align: center;
                margin-top: 32px;
                padding-top: 16px;
                border-top: 1px solid #e5e7eb;
                color: #6b7280;
                font-size: 14px;
            }
            .cta-button {
                display: inline-block;
                background: #fbbf24;
                color: #0a0a0a;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
                margin: 16px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">
                    CARBONO<span class="highlight">14</span>
                </div>
                <p>¡Tus entradas están listas!</p>
            </div>

            <h1>¡Hola ${buyerName}! 👋</h1>
            
            <p>Tu pago ha sido procesado exitosamente. Aquí están tus entradas para:</p>

            <div class="event-info">
                <div class="event-name">${event.name}</div>
                <div class="event-details">
                    📅 ${event.date} a las ${event.time}<br>
                    📍 ${event.location}, ${event.city}
                </div>
            </div>

            <div class="tickets-section">
                <h3>🎫 Tus Entradas</h3>
                ${tickets
                  .map(
                    (ticket) => `
                    <div class="ticket">
                        <div class="ticket-info">
                            <div class="ticket-type">${
                              ticket.ticketType.name
                            }</div>
                            <div class="ticket-code">${ticket.qrCode}</div>
                        </div>
                        <div class="ticket-price">$${ticket.ticketType.price.toLocaleString()}</div>
                    </div>
                `
                  )
                  .join("")}
            </div>

            <div class="total">
                <div>Total Pagado</div>
                <div class="total-amount">$${totalAmount.toLocaleString()}</div>
            </div>

            <div class="instructions">
                <h3>📋 Instrucciones Importantes</h3>
                <ul>
                    <li><strong>Presenta tu QR code</strong> en la entrada del evento</li>
                    <li><strong>Lleva tu DNI</strong> para verificar identidad</li>
                    <li><strong>Guarda este email</strong> y el PDF adjunto</li>
                    <li><strong>Llegada:</strong> Te recomendamos llegar 30 min antes</li>
                    <li><strong>Sin reentradas:</strong> Una vez que salgas, no podrás volver a entrar</li>
                </ul>
            </div>

            <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/events/${event.name
      .toLowerCase()
      .replace(/\s+/g, "-")}" class="cta-button">
                    Ver Detalles del Evento
                </a>
            </div>

            <div class="footer">
                <p>
                    ¿Problemas con tus entradas? Contáctanos en 
                    <a href="mailto:soporte@carbonotickets.com">soporte@carbonotickets.com</a>
                </p>
                <p>
                    <strong>Carbono Tickets</strong> - Democratizando la música underground
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private static async generateTicketPDF(
    data: EmailTicketData
  ): Promise<Buffer> {
    // Para el MVP, vamos a generar un PDF simple
    // Puedes usar jsPDF o una alternativa más robusta como Puppeteer

    const { jsPDF } = await import("jspdf");
    const QRCode = await import("qrcode");

    const pdf = new jsPDF();
    const { event, tickets, buyerName, totalAmount } = data;

    // Configuración del PDF
    let yPosition = 20;
    const pageWidth = pdf.internal.pageSize.width;
    const centerX = pageWidth / 2;

    // Header
    pdf.setFontSize(24);
    pdf.setFont("times", "bold");
    pdf.text("CARBONO14", centerX, yPosition, { align: "center" });

    yPosition += 10;
    pdf.setFontSize(16);
    pdf.setFont("times", "normal");
    pdf.text("Tickets de Entrada", centerX, yPosition, { align: "center" });

    yPosition += 20;

    // Event Info
    pdf.setFontSize(18);
    pdf.setFont("times", "bold");
    pdf.text(event.name, centerX, yPosition, { align: "center" });

    yPosition += 8;
    pdf.setFontSize(12);
    pdf.setFont("times", "normal");
    pdf.text(`${event.date} - ${event.time}`, centerX, yPosition, {
      align: "center",
    });

    yPosition += 6;
    pdf.text(`${event.location}, ${event.city}`, centerX, yPosition, {
      align: "center",
    });

    yPosition += 20;

    // Buyer Info
    pdf.setFontSize(14);
    pdf.setFont("times", "bold");
    pdf.text(`Comprador: ${buyerName}`, 20, yPosition);

    yPosition += 15;

    // Tickets
    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i];

      // Check if we need a new page
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      // Ticket border
      pdf.rect(15, yPosition - 5, pageWidth - 30, 60);

      // Ticket info
      pdf.setFontSize(14);
      pdf.setFont("times", "bold");
      pdf.text(`Ticket ${i + 1}: ${ticket.ticketType.name}`, 20, yPosition + 5);

      pdf.setFontSize(12);
      pdf.setFont("times", "normal");
      pdf.text(
        `Precio: $${ticket.ticketType.price.toLocaleString()}`,
        20,
        yPosition + 15
      );
      pdf.text(`Código: ${ticket.qrCode}`, 20, yPosition + 25);

      // Generate QR Code
      try {
        const qrCodeDataUrl = await QRCode.toDataURL(ticket.qrCode, {
          width: 80,
          margin: 1,
        });

        pdf.addImage(qrCodeDataUrl, "PNG", pageWidth - 70, yPosition, 50, 50);
      } catch (error) {
        console.error("Error generating QR code for PDF:", error);
      }

      yPosition += 70;
    }

    // Total
    yPosition += 10;
    pdf.setFontSize(16);
    pdf.setFont("times", "bold");
    pdf.text(`Total: $${totalAmount.toLocaleString()}`, centerX, yPosition, {
      align: "center",
    });

    // Instructions
    yPosition += 20;
    pdf.setFontSize(10);
    pdf.setFont("times", "normal");
    const instructions = [
      "• Presenta este QR code en la entrada del evento",
      "• Lleva tu DNI para verificar identidad",
      "• Conserva este PDF hasta después del evento",
      "• Para soporte: soporte@carbonotickets.com",
    ];

    instructions.forEach((instruction) => {
      pdf.text(instruction, 20, yPosition);
      yPosition += 6;
    });

    return Buffer.from(pdf.output("arraybuffer"));
  }
}
