
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = "shophub@24digital.dev"; // Updated sender email
const TEST_EMAIL = "shophub@24digital.dev"; // Updated test recipient email

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderEmailRequest {
  to: string;
  orderDetails: {
    id: string;
    items: Array<{
      title: string;
      quantity: number;
      price: number;
    }>;
    total: number;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received request to send order confirmation email");
    console.log("RESEND_API_KEY present:", !!RESEND_API_KEY);
    
    const emailRequest: OrderEmailRequest = await req.json();
    console.log("Email request data:", emailRequest);

    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY environment variable");
    }

    const itemsList = emailRequest.orderDetails.items
      .map(
        (item) =>
          `<tr>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${item.title}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">$${item.price.toFixed(2)}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
          </tr>`
      )
      .join("");

    // Improved HTML template with better spam score
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .container {
            padding: 0;
            background-color: #ffffff;
          }
          .header {
            background-color: #f8fafc;
            padding: 30px 20px;
            text-align: center;
            border-bottom: 2px solid #e2e8f0;
          }
          .header h1 {
            color: #1f2937;
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: 600;
          }
          .header p {
            color: #6b7280;
            margin: 0;
            font-size: 16px;
          }
          .content {
            padding: 30px 20px;
            background-color: #ffffff;
          }
          .order-number {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 25px;
          }
          .order-number h2 {
            margin: 0;
            color: #374151;
            font-size: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background-color: #ffffff;
          }
          th {
            background-color: #f9fafb;
            text-align: left;
            padding: 15px 12px;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
          }
          .total-row {
            font-weight: 600;
            background-color: #f9fafb;
            border-top: 2px solid #e5e7eb;
          }
          .total-row td {
            padding: 15px 12px;
            font-size: 18px;
            color: #1f2937;
          }
          .confirmation-section {
            background-color: #ecfdf5;
            border: 1px solid #d1fae5;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
          }
          .confirmation-section h3 {
            color: #065f46;
            margin: 0 0 10px 0;
          }
          .confirmation-number {
            font-family: 'Courier New', monospace;
            font-weight: bold;
            font-size: 16px;
            color: #059669;
          }
          .footer {
            background-color: #f8fafc;
            padding: 25px 20px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
            border-top: 1px solid #e2e8f0;
          }
          .footer p {
            margin: 5px 0;
          }
          .support-info {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
          }
          @media only screen and (max-width: 600px) {
            .container {
              width: 100% !important;
            }
            .header, .content, .footer {
              padding: 20px 15px !important;
            }
            table {
              font-size: 14px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
            <p>Thank you for your purchase!</p>
          </div>
          
          <div class="content">
            <div class="order-number">
              <h2>Order #${emailRequest.orderDetails.id}</h2>
            </div>
            
            <p>Dear Valued Customer,</p>
            <p>Thank you for your order! We have received your purchase and it is currently being processed. Below are the details of your order:</p>
            
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Price</th>
                  <th style="text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
                <tr class="total-row">
                  <td colspan="3" style="text-align: right;"><strong>Order Total:</strong></td>
                  <td style="text-align: right;"><strong>$${emailRequest.orderDetails.total.toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>
            
            <div class="confirmation-section">
              <h3>Order Confirmation Details</h3>
              <p>Confirmation Number: <span class="confirmation-number">${Math.random().toString(36).substring(7).toUpperCase()}</span></p>
              <p>Order Date: ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
            
            <div class="support-info">
              <p>If you have any questions about your order, please don't hesitate to contact our customer support team. We're here to help!</p>
              <p>You will receive a shipping notification email once your order has been dispatched.</p>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>ShopHub</strong></p>
            <p>&copy; ${new Date().getFullYear()} ShopHub. All rights reserved.</p>
            <p>This email was sent to confirm your recent purchase. Please keep this email for your records.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Enhanced plain text version for better deliverability
    const plainText = `
Order Confirmation - Order #${emailRequest.orderDetails.id}

Dear Valued Customer,

Thank you for your order! We have received your purchase and it is currently being processed.

Order Details:
${emailRequest.orderDetails.items.map(item => 
  `- ${item.title} (Qty: ${item.quantity}) - $${item.price.toFixed(2)} = $${(item.price * item.quantity).toFixed(2)}`
).join('\n')}

Order Total: $${emailRequest.orderDetails.total.toFixed(2)}

Confirmation Number: ${Math.random().toString(36).substring(7).toUpperCase()}
Order Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

If you have any questions about your order, please contact our customer support team.

Best regards,
ShopHub Team

© ${new Date().getFullYear()} ShopHub. All rights reserved.
    `.trim();

    console.log("Sending email via Resend API");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `ShopHub <${FROM_EMAIL}>`, // Better from name format
        to: [emailRequest.to],
        subject: `Order Confirmation #${emailRequest.orderDetails.id} - Thank you for your purchase`,
        html: html,
        text: plainText, // Include plain text version
        headers: {
          'X-Priority': '3', // Normal priority
          'X-Mailer': 'ShopHub Order System',
          'List-Unsubscribe': '<mailto:unsubscribe@24digital.dev>', // Anti-spam header
        },
        tags: [
          {
            name: 'category',
            value: 'order_confirmation'
          }
        ]
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Email sent successfully:", data);
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      const error = await res.text();
      console.error("Error from Resend API:", error);
      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    console.error("Error in send-order-confirmation function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
