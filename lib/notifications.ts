import { formatCurrency } from "./utils";

interface SendOrderConfirmationParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    product_title: string;
    variant_title?: string | null;
    quantity: number;
    unit_price: number;
    image_url?: string;
  }>;
  total: number;
  shippingAddress: {
    street_address: string;
    city: string;
    state: string;
    postal_code: string;
  };
}

interface SendStatusUpdateParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  trackingNumber?: string;
  shippingCarrier?: string;
}

export async function sendOrderConfirmationNotification(params: SendOrderConfirmationParams) {
  const { orderNumber, customerName, customerEmail, items, total, shippingAddress } = params;

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.NOTIFICATION_FROM_EMAIL || "orders@distributehappiness.com";

  const itemsHtml = items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #f0f0f0;">
        <td style="padding: 12px 0;">
          <strong style="color: #111; font-size: 14px;">${item.product_title}</strong>
          ${item.variant_title ? `<br/><span style="color: #666; font-size: 12px;">Variant: ${item.variant_title}</span>` : ""}
          <br/><span style="color: #888; font-size: 12px;">Qty: ${item.quantity}</span>
        </td>
        <td style="padding: 12px 0; text-align: right; font-weight: 600; color: #111;">
          ₹${(item.unit_price * item.quantity).toLocaleString("en-IN")}
        </td>
      </tr>`
    )
    .join("");

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation #${orderNumber}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7f7f9; margin: 0; padding: 30px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); border: 1px solid #eef0f2;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #FF5733, #FF8C00); padding: 36px 30px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">🎁 Distribute Happiness</h1>
          <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.95;">Thank you for your order, ${customerName}!</p>
        </div>

        <div style="padding: 30px;">
          <!-- Status Callout -->
          <div style="background: #FFF5F2; border: 1px solid #FFE0D6; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 13px; color: #C2410C; font-weight: 600;">Order Reference: #${orderNumber}</p>
            <p style="margin: 4px 0 0; font-size: 12px; color: #431407;">
              Our artisans have received your customization details and will begin preparing your personalized keepsakes shortly.
            </p>
          </div>

          <!-- Items Table -->
          <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #71717A; margin: 0 0 12px;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            ${itemsHtml}
            <tr>
              <td style="padding: 14px 0 0; font-weight: 700; font-size: 15px; color: #111;">Total Amount</td>
              <td style="padding: 14px 0 0; text-align: right; font-weight: 900; font-size: 18px; color: #FF5733;">
                ₹${total.toLocaleString("en-IN")}
              </td>
            </tr>
          </table>

          <!-- Shipping Destination -->
          <div style="border-top: 1px solid #f0f0f0; padding-top: 20px; margin-top: 20px;">
            <h4 style="font-size: 12px; text-transform: uppercase; color: #71717A; margin: 0 0 6px;">Delivery Address</h4>
            <p style="margin: 0; font-size: 13px; color: #27272A; line-height: 1.5;">
              ${shippingAddress.street_address}<br/>
              ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.postal_code}
            </p>
          </div>

          <!-- WhatsApp Connect CTA -->
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
            <p style="font-size: 12px; color: #71717A; margin-bottom: 12px;">Need to adjust custom engraving text or have questions?</p>
            <a href="https://wa.me/919876543210?text=Hello%20Distribute%20Happiness,%20regarding%20my%20order%20%23${orderNumber}"
               style="display: inline-block; background: #10B981; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-weight: 700; font-size: 13px;">
              Chat with Concierge on WhatsApp
            </a>
          </div>
        </div>

        <div style="background: #fafafa; padding: 16px; text-align: center; border-top: 1px solid #f0f0f0; font-size: 11px; color: #A1A1AA;">
          © ${new Date().getFullYear()} Distribute Happiness. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [customerEmail],
          subject: `🎁 Order Confirmation #${orderNumber} — Distribute Happiness`,
          html: emailHtml,
        }),
      });
      const data = await res.json();
      return { success: res.ok, data };
    } catch (err) {
      console.error("Failed to send order email via Resend:", err);
      return { success: false, error: err };
    }
  } else {
    // Graceful simulation mode
    console.log(`[Notification Simulation] Order confirmation email sent to ${customerEmail} for order #${orderNumber}`);
    return { success: true, simulated: true };
  }
}

export async function sendStatusUpdateNotification(params: SendStatusUpdateParams) {
  const { orderNumber, customerName, customerEmail, status, trackingNumber, shippingCarrier } = params;

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.NOTIFICATION_FROM_EMAIL || "orders@distributehappiness.com";

  const statusTitles: Record<string, string> = {
    proof_review: "Your Custom Proof is Ready for Review 🎨",
    in_production: "Your Keepsake is in Production ⚡",
    shipped: "Your Order is Dispatched & On Its Way! 🚚",
    delivered: "Your Package Has Been Delivered 🎉",
  };

  const subject = statusTitles[status] || `Order Update #${orderNumber} — Distribute Happiness`;

  const trackingSnippet = trackingNumber
    ? `
      <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0; font-size: 12px; color: #1E40AF; font-weight: 700;">COURIER TRACKING DETAILS</p>
        <p style="margin: 4px 0 0; font-size: 14px; font-weight: 600; color: #1E3A8A;">
          ${shippingCarrier || "Express Courier"}: <span style="font-family: monospace;">${trackingNumber}</span>
        </p>
      </div>
    `
    : "";

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7f7f9; margin: 0; padding: 30px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #eef0f2;">
        <div style="background: #18181B; padding: 28px 30px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0; font-size: 20px;">Distribute Happiness</h2>
          <p style="margin: 4px 0 0; font-size: 13px; color: #A1A1AA;">Status Update for Order #${orderNumber}</p>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 15px; color: #27272A; margin: 0 0 16px;">
            Hi ${customerName},
          </p>
          <p style="font-size: 14px; color: #52525B; line-height: 1.6; margin: 0 0 16px;">
            Your order status has been updated to: <strong style="color: #FF5733; text-transform: uppercase;">${status.replace("_", " ")}</strong>.
          </p>
          ${trackingSnippet}
          <div style="text-align: center; margin-top: 24px;">
            <a href="${process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000"}/orders/${orderNumber}"
               style="display: inline-block; background: #FF5733; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-weight: 700; font-size: 13px;">
              Track Order Live
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [customerEmail],
          subject,
          html: emailHtml,
        }),
      });
      return { success: res.ok };
    } catch (err) {
      console.error("Failed to send status update email:", err);
      return { success: false, error: err };
    }
  } else {
    console.log(`[Notification Simulation] Status update email (${status}) sent to ${customerEmail} for order #${orderNumber}`);
    return { success: true, simulated: true };
  }
}
