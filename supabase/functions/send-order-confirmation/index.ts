
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("resend");
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

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
          }
          .header {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid #e2e8f0;
          }
          .content {
            padding: 20px;
          }
          .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e2e8f0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th {
            background-color: #f3f4f6;
            text-align: left;
            padding: 12px;
          }
          .total-row {
            font-weight: bold;
            background-color: #f9fafb;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Order Confirmation</h1>
          <p>Thank you for your order!</p>
        </div>
        <div class="content">
          <h2>Order #${emailRequest.orderDetails.id}</h2>
          <p>Your order has been confirmed and is being processed. Here are your order details:</p>
          
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
              <tr class="total-row">
                <td colspan="3" style="padding: 12px; text-align: right;">Total:</td>
                <td style="padding: 12px; text-align: right;">$${emailRequest.orderDetails.total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          
          <p>Order confirmation number: ${Math.random().toString(36).substring(7).toUpperCase()}</p>
          <p>If you have any questions about your order, please contact our customer service.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Shop. All rights reserved.
        </div>
      </body>
      </html>
    `;

    console.log("Sending email via Resend API");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [emailRequest.to], // Send to actual customer email instead of test email
        subject: `Order Confirmation #${emailRequest.orderDetails.id}`,
        html: html,
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
