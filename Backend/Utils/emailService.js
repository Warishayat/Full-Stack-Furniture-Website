const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a premium HTML order confirmation email to the customer
 * @param {string} recipientEmail - Customer email address
 * @param {object} order - The Order document/object containing all order details
 */
const sendOrderConfirmationEmail = async (recipientEmail, order) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Email service skipped: EMAIL_USER or EMAIL_PASS environment variables are not set.");
      return;
    }

    const orderIdShort = order._id.toString().slice(-8).toUpperCase();
    const formattedDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    // Helper to safely extract names from field objects
    const getFieldValue = (field) => {
      if (!field) return "";
      if (typeof field === "string") return field;
      if (typeof field === "object") {
        if (field.name) return field.name;
        return field.toString();
      }
      return "";
    };

    // Generate HTML for the list of items with proper field extractions
    const itemsHtml = order.items.map(item => {
      const variantName = getFieldValue(item.variant) || 'Standard';
      const materialName = getFieldValue(item.material);
      const colorName = getFieldValue(item.color);
      
      const detailsArray = [];
      if (variantName) detailsArray.push(variantName);
      if (materialName) detailsArray.push(materialName);
      if (colorName) detailsArray.push(colorName);
      const detailsStr = detailsArray.join(" • ");

      return `
      <tr style="border-b: 1px solid #f1f5f9;">
        <td style="padding: 16px 0; vertical-align: middle;">
          ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0; margin-right: 12px; float: left;" />` : ""}
          <div style="float: left;">
            <p style="margin: 0; font-weight: bold; color: #1e293b; font-size: 14px;">${item.title}</p>
            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 600;">
              ${detailsStr}
            </p>
          </div>
        </td>
        <td style="padding: 16px 0; text-align: center; color: #475569; font-size: 14px; font-weight: 500; vertical-align: middle;">
          ${item.quantity}
        </td>
        <td style="padding: 16px 0; text-align: right; color: #1e293b; font-weight: bold; font-size: 14px; vertical-align: middle;">
          £${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>
      `;
    }).join("");

    // Read delivery notes (usually stores selected delivery dates)
    const deliveryDateStr = order.notes ? order.notes.replace("Delivery Date: ", "") : "Estimated 9-13 days";

    // Setup beautiful, luxury themed email template
    const mailOptions = {
      from: `"EliteSeating LTD" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `Your Order is Confirmed: #${orderIdShort}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" max-width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); border: 1px solid #e2e8f0; border-collapse: collapse;">
                  
                  <!-- Luxury Header -->
                  <tr>
                    <td align="center" style="background-color: #1e293b; padding: 40px 40px 32px 40px; color: #ffffff;">
                      <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; font-family: Garamond, Georgia, serif;">ELITESEATING</h1>
                      <p style="margin: 4px 0 24px 0; font-size: 9px; letter-spacing: 0.3em; color: #94a3b8; font-weight: 600; text-transform: uppercase;">Premium Bespoke Seating</p>
                      
                      <div style="width: 48px; height: 1px; background-color: #ef4444; margin: 0 auto 24px auto;"></div>
                      
                      <h2 style="margin: 0; font-size: 26px; font-weight: 400; font-family: Garamond, Georgia, serif; letter-spacing: -0.02em;">Your order is confirmed</h2>
                      <p style="margin: 8px 0 0 0; color: #cbd5e1; font-size: 14px;">Thank you for your order, we are curating your exquisite selection.</p>
                    </td>
                  </tr>

                  <!-- Confirmation Badge & Meta Info -->
                  <tr>
                    <td style="padding: 32px 40px 0px 40px;">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; border-radius: 12px; padding: 16px 20px;">
                        <tr>
                          <td>
                            <span style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; tracking: 0.05em; display: block; margin-bottom: 4px;">Order Reference</span>
                            <span style="font-size: 16px; font-weight: bold; color: #1e293b; font-family: monospace;">#${orderIdShort}</span>
                          </td>
                          <td align="right">
                            <span style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; tracking: 0.05em; display: block; margin-bottom: 4px;">Date Placed</span>
                            <span style="font-size: 14px; font-weight: bold; color: #1e293b;">${formattedDate}</span>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2" style="padding-top: 12px; border-top: 1px solid #cbd5e1; margin-top: 12px;">
                            <span style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; tracking: 0.05em; display: block; margin-bottom: 4px;">Order Tracking ID</span>
                            <span style="font-size: 13px; font-weight: bold; color: #1e293b; font-family: monospace; word-break: break-all;">${order._id}</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Items Table -->
                  <tr>
                    <td style="padding: 32px 40px 0 40px;">
                      <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: bold; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; border-b: 1px solid #e2e8f0; padding-bottom: 8px;">Order summary</h3>
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                        <thead>
                          <tr style="border-bottom: 2px solid #e2e8f0; text-align: left; font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase;">
                            <th style="padding-bottom: 12px;">Item Details</th>
                            <th style="padding-bottom: 12px; text-align: center; width: 60px;">Qty</th>
                            <th style="padding-bottom: 12px; text-align: right; width: 100px;">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${itemsHtml}
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  <!-- Pricing Summary Block -->
                  <tr>
                    <td style="padding: 16px 40px 0 40px;">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 2px solid #f1f5f9; padding-top: 16px;">
                        <tr>
                          <td style="font-size: 14px; color: #64748b; padding: 6px 0;">Order subtotal</td>
                          <td align="right" style="font-size: 14px; font-weight: bold; color: #1e293b; padding: 6px 0;">£${order.totalPrice.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td style="font-size: 14px; color: #64748b; padding: 6px 0;">Delivery</td>
                          <td align="right" style="font-size: 14px; font-weight: bold; color: #22c55e; padding: 6px 0;">Complimentary</td>
                        </tr>
                        <tr>
                          <td style="font-size: 14px; color: #64748b; padding: 6px 0;">VAT</td>
                          <td align="right" style="font-size: 14px; font-weight: bold; color: #64748b; padding: 6px 0;">£0.00</td>
                        </tr>
                        <tr style="border-top: 1px solid #f1f5f9;">
                          <td style="font-size: 18px; font-weight: bold; color: #1e293b; padding: 16px 0 0 0;">Total Paid</td>
                          <td align="right" style="font-size: 22px; font-weight: 800; color: #1e293b; padding: 16px 0 0 0;">£${order.totalPrice.toLocaleString()}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Logistics and Delivery Details -->
                  <tr>
                    <td style="padding: 32px 40px 40px 40px;">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
                        <tr>
                          <td width="50%" valign="top" style="padding-right: 20px;">
                            <h4 style="margin: 0 0 12px 0; font-size: 12px; font-weight: bold; color: #475569; text-transform: uppercase; letter-spacing: 0.05em;">Delivery Address</h4>
                            <p style="margin: 0; font-size: 14px; font-weight: bold; color: #1e293b; line-height: 1.5;">${order.shippingAddress.fullName}</p>
                            <p style="margin: 4px 0 0 0; font-size: 13px; color: #475569; line-height: 1.5;">
                              ${order.shippingAddress.address}<br />
                              ${order.shippingAddress.city ? order.shippingAddress.city + ', ' : ''}${order.shippingAddress.postalCode}<br />
                              United Kingdom
                            </p>
                            ${order.shippingAddress.phone ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: #64748b;">Phone: ${order.shippingAddress.phone}</p>` : ""}
                          </td>
                          <td width="50%" valign="top" style="padding-left: 20px; border-left: 1px solid #f1f5f9;">
                            <h4 style="margin: 0 0 12px 0; font-size: 12px; font-weight: bold; color: #475569; text-transform: uppercase; letter-spacing: 0.05em;">Artisanal Delivery Details</h4>
                            <p style="margin: 0; font-size: 14px; font-weight: bold; color: #51823f; line-height: 1.5;">${deliveryDateStr}</p>
                            <p style="margin: 4px 0 0 0; font-size: 13px; color: #475569; line-height: 1.5;">
                              Bespoke premium white-glove logistics. Our white-glove professionals will fully assemble and position your purchase in your room of choice.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Fine Print Footer -->
                  <tr>
                    <td align="center" style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 32px 40px; text-align: center;">
                      <p style="margin: 0; font-size: 13px; color: #475569; font-weight: 500;">Need assistance with your luxurious seating layout?</p>
                      <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b;">
                        Reach out to our specialist concierges at <a href="mailto:eilteseatingltd@gmail.com" style="color: #ef4444; text-decoration: none; font-weight: bold;">eilteseatingltd@gmail.com</a>
                      </p>
                      <div style="margin: 24px 0; height: 1px; background-color: #e2e8f0; width: 100%;"></div>
                      <p style="margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.6;">
                        &copy; ${new Date().getFullYear()} EliteSeating LTD. All rights reserved.<br />
                        High-End Premium Artisan Seating Manufacturers & White-Glove Logistics.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    // Silent error handler
  }
};

module.exports = {
  sendOrderConfirmationEmail,
};
