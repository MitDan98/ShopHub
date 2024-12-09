import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = "orders@yourdomain.com"; // Replace with your verified domain email

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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, orderDetails }: OrderEmailRequest = await req.json();

    const itemsList = orderDetails.items
      .map(
        (item) =>
          `<li>${item.title} x ${item.quantity} - $${(
            item.price * item.quantity
          ).toFixed(2)}</li>`
      )
      .join("");

    const html = `
      <h1>Order Confirmation</h1>
      <p>Thank you for your order!</p>
      <h2>Order Details (#${orderDetails.id})</h2>
      <ul>
        ${itemsList}
      </ul>
      <p><strong>Total: $${orderDetails.total.toFixed(2)}</strong></p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject: `Order Confirmation #${orderDetails.id}`,
        html: html,
      }),
    });

    const data = await res.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);