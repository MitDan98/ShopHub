import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("resend");
const FROM_EMAIL = "onboarding@resend.dev"; // Using your provided email

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
          `<li>${item.title} x ${item.quantity} - $${(
            item.price * item.quantity
          ).toFixed(2)}</li>`
      )
      .join("");

    const html = `
      <h1>Order Confirmation</h1>
      <p>Thank you for your order! Here are your order details:</p>
      <h2>Order #${emailRequest.orderDetails.id}</h2>
      <ul>
        ${itemsList}
      </ul>
      <p><strong>Total: $${emailRequest.orderDetails.total.toFixed(2)}</strong></p>
      <p>Random confirmation number: ${Math.random().toString(36).substring(7)}</p>
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
        to: [emailRequest.to],
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