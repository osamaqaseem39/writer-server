const nodemailer = require('nodemailer');

function buildTransport() {
  // Prefer SMTP creds from env; otherwise noop transport
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && port && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: { user, pass },
    });
  }

  // Fallback transport that just logs
  return {
    sendMail: async (options) => {
      console.warn('Email transport not configured. Email would have been sent with options:', options);
      return { accepted: [options.to], messageId: 'dev-fallback' };
    },
  };
}

function formatCurrencyPKR(value) {
  try {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(value);
  } catch (_) {
    return `PKR ${Number(value || 0).toFixed(0)}`;
  }
}

function buildAdminOrderEmailHtml(order) {
  const total = (order.totalAmount || 0);
  const shipping = order.shippingCharges || 0;
  const itemsHtml = (order.items || [])
    .map(i => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee;">${i.title}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;">${i.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;">${formatCurrencyPKR(i.price)}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;">${formatCurrencyPKR((i.price || 0) * (i.quantity || 1))}</td>
      </tr>
    `).join('');

  const addr = order.shippingAddress || {};

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111;">
      <h2>New COD Order Received</h2>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <p><strong>Payment Status:</strong> ${order.paymentStatus || 'Unpaid'}</p>
      <h3>Customer</h3>
      <p>
        ${addr.firstName || ''} ${addr.lastName || ''}<br/>
        ${addr.email || ''}<br/>
        ${addr.phone || ''}
      </p>
      <h3>Shipping Address</h3>
      <p>
        ${addr.address || ''}<br/>
        ${addr.city || ''}, ${addr.state || ''} ${addr.zipCode || ''}<br/>
        ${addr.country || ''}
      </p>
      <h3>Items</h3>
      <table style="border-collapse:collapse;width:100%;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px;border-bottom:2px solid #333;">Title</th>
            <th style="text-align:left;padding:8px;border-bottom:2px solid #333;">Qty</th>
            <th style="text-align:left;padding:8px;border-bottom:2px solid #333;">Price</th>
            <th style="text-align:left;padding:8px;border-bottom:2px solid #333;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <p style="margin-top:12px;"><strong>Shipping:</strong> ${formatCurrencyPKR(shipping)}</p>
      <p style="margin:4px 0 12px 0;"><strong>Total:</strong> ${formatCurrencyPKR(total)}</p>
      <p><em>Payment Method:</em> ${order.paymentMethod || 'COD'}</p>
    </div>
  `;
}

function buildCustomerOrderEmailHtml(order) {
  const total = (order.totalAmount || 0);
  const shipping = order.shippingCharges || 0;
  const addr = order.shippingAddress || {};
  const customerName = `${addr.firstName || ''} ${addr.lastName || ''}`.trim() || 'Customer';
  
  const itemsHtml = (order.items || [])
    .map(i => `
      <tr>
        <td style="padding:12px;border-bottom:1px solid #eee;">${i.title}</td>
        <td style="padding:12px;border-bottom:1px solid #eee;text-align:center;">${i.quantity}</td>
        <td style="padding:12px;border-bottom:1px solid #eee;text-align:right;">${formatCurrencyPKR((i.price || 0) * (i.quantity || 1))}</td>
      </tr>
    `).join('');

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111;max-width:600px;margin:0 auto;">
      <div style="background:linear-gradient(to right, #567C8D, #2F4156);color:#fff;padding:30px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="margin:0;font-size:28px;">Order Confirmed!</h1>
      </div>
      <div style="background:#fff;padding:30px;border:1px solid #ddd;border-top:none;">
        <p style="font-size:16px;color:#333;">Dear ${customerName},</p>
        <p style="font-size:16px;color:#333;line-height:1.6;">
          Thank you for your order! We've received your order and will begin processing it shortly.
        </p>
        
        <div style="background:#f9f9f9;padding:20px;border-radius:8px;margin:20px 0;">
          <p style="margin:0 0 10px 0;font-weight:bold;color:#2F4156;">Order Details</p>
          <p style="margin:5px 0;color:#666;"><strong>Order ID:</strong> #${order._id.slice(-8).toUpperCase()}</p>
          <p style="margin:5px 0;color:#666;"><strong>Order Date:</strong> ${new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
          <p style="margin:5px 0;color:#666;"><strong>Payment Method:</strong> Cash on Delivery (COD)</p>
        </div>

        <h3 style="color:#2F4156;margin-top:30px;margin-bottom:15px;">Items Ordered</h3>
        <table style="border-collapse:collapse;width:100%;background:#fff;">
          <thead>
            <tr style="background:#f5f5f5;">
              <th style="text-align:left;padding:12px;border-bottom:2px solid #ddd;">Item</th>
              <th style="text-align:center;padding:12px;border-bottom:2px solid #ddd;">Quantity</th>
              <th style="text-align:right;padding:12px;border-bottom:2px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top:20px;padding-top:20px;border-top:2px solid #ddd;">
          <div style="display:flex;justify-content:space-between;margin:10px 0;">
            <span style="color:#666;">Subtotal:</span>
            <span style="color:#333;font-weight:bold;">${formatCurrencyPKR(total - shipping)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin:10px 0;">
            <span style="color:#666;">Shipping:</span>
            <span style="color:#333;font-weight:bold;">${shipping > 0 ? formatCurrencyPKR(shipping) : 'Free'}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin:15px 0;padding-top:15px;border-top:1px solid #ddd;">
            <span style="color:#2F4156;font-size:18px;font-weight:bold;">Total:</span>
            <span style="color:#2F4156;font-size:18px;font-weight:bold;">${formatCurrencyPKR(total)}</span>
          </div>
        </div>

        <div style="background:#fff3cd;border-left:4px solid #ffc107;padding:15px;margin:30px 0;border-radius:4px;">
          <p style="margin:0;color:#856404;font-weight:bold;">Payment Information</p>
          <p style="margin:5px 0 0 0;color:#856404;">
            This is a Cash on Delivery order. Please have the exact amount (${formatCurrencyPKR(total)}) ready when your order arrives.
          </p>
        </div>

        <div style="background:#f9f9f9;padding:20px;border-radius:8px;margin:20px 0;">
          <p style="margin:0 0 10px 0;font-weight:bold;color:#2F4156;">Shipping Address</p>
          <p style="margin:5px 0;color:#666;">
            ${addr.firstName || ''} ${addr.lastName || ''}<br/>
            ${addr.address || ''}<br/>
            ${addr.city || ''}, ${addr.state || ''} ${addr.zipCode || ''}<br/>
            ${addr.country || ''}
          </p>
        </div>

        <p style="font-size:16px;color:#333;line-height:1.6;margin-top:30px;">
          We'll send you another email once your order ships. If you have any questions, feel free to contact us.
        </p>
        
        <p style="font-size:16px;color:#333;line-height:1.6;margin-top:20px;">
          Best regards,<br/>
          <strong>Nawa Sohail</strong>
        </p>
      </div>
      <div style="background:#f5f5f5;padding:20px;text-align:center;border-radius:0 0 8px 8px;border:1px solid #ddd;border-top:none;">
        <p style="margin:0;color:#666;font-size:14px;">
          Questions? Email us at <a href="mailto:order@nawasohail.com" style="color:#567C8D;">order@nawasohail.com</a>
        </p>
      </div>
    </div>
  `;
}

async function sendOrderNotificationEmail(order) {
  const transporter = buildTransport();
  
  // Get email addresses from env or use defaults
  const ordersEmail = process.env.ORDERS_EMAIL || 'orders@nawasohail.com';
  const connectEmail = process.env.CONNECT_EMAIL || 'connect@nawasohail.com';
  const orderNotificationEmail = process.env.ORDER_NOTIFICATION_EMAIL || 'order@nawasohail.com';
  const connectName = process.env.CONNECT_EMAIL_NAME || 'Nawa Sohail';
  const ordersName = process.env.ORDERS_EMAIL_NAME || 'Nawa Sohail Books';
  
  const customerEmail = order.shippingAddress?.email;
  const customerName = `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim() || 'Customer';

  // Email 1: Admin notification (from connect@nawasohail.com to order@nawasohail.com)
  if (orderNotificationEmail) {
    const adminSubject = `New Order ${order._id.slice(-8).toUpperCase()} - ${customerName}`;
    const adminHtml = buildAdminOrderEmailHtml(order);
    
    try {
      await transporter.sendMail({
        from: `${connectName} <${connectEmail}>`,
        replyTo: connectEmail,
        to: orderNotificationEmail,
        subject: adminSubject,
        html: adminHtml,
      });
      console.log('Admin order notification email sent to', orderNotificationEmail);
    } catch (error) {
      console.error('Failed to send admin notification email:', error);
    }
  }

  // Email 2: Customer confirmation (from orders@nawasohail.com to customer)
  if (customerEmail) {
    const customerSubject = `Order Confirmation - Order #${order._id.slice(-8).toUpperCase()}`;
    const customerHtml = buildCustomerOrderEmailHtml(order);
    
    try {
      await transporter.sendMail({
        from: `${ordersName} <${ordersEmail}>`,
        replyTo: orderNotificationEmail || ordersEmail,
        to: customerEmail,
        subject: customerSubject,
        html: customerHtml,
      });
      console.log('Customer order confirmation email sent to', customerEmail);
    } catch (error) {
      console.error('Failed to send customer confirmation email:', error);
    }
  }
}

module.exports = { sendOrderNotificationEmail };


