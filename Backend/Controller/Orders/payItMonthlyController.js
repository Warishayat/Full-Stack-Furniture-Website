const Order = require('../../Schemas/Order');
const payItMonthlyService = require('../../Utils/payItMonthlyService');

// Assuming you have partner uuid configured in your .env or similar.
// If it's not provided by the user, we will expect it from env.
const PARTNER_UUID = process.env.PAYITMONTHLY_PARTNER_UUID || "YOUR_PARTNER_UUID_HERE";

exports.createPayItMonthlyCheckout = async (req, res) => {
  try {
    const { items, shippingAddress, email, createAccount, password, deliveryDate, assemblyService } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    let orderUser = null;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
        orderUser = await require('../../Schemas/User').findById(decoded.id).select("-password");
      } catch (err) {}
    }

    let resolvedUser = orderUser;
    if (!resolvedUser && createAccount && email && password) {
      const existingUser = await require('../../Schemas/User').findOne({ email });
      if (!existingUser) {
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(password, 10);
        const name = shippingAddress?.fullName || email.split("@")[0];
        const newUser = new require('../../Schemas/User')({ name, email, password: hashedPassword, role: "user" });
        await newUser.save();
        resolvedUser = newUser;
      } else {
        resolvedUser = existingUser;
      }
    }

    const Product = require('../../Schemas/Product');
    const orderItems = await Promise.all(items.map(async (item) => {
      const productDoc = await Product.findById(item.product);
      if (!productDoc) throw new Error(`Product not found: ${item.title}`);
      
      const variantDoc = productDoc.variants.find(v => v.name === (item.variant || "Standard"));
      const securePrice = variantDoc ? variantDoc.price : 0;

      let finalSecurePrice = securePrice;
      if (item.footstool === 'Yes') finalSecurePrice += 149;
      if (item.coffeeTable === 'Yes') finalSecurePrice += 199;

      return {
        product: productDoc._id,
        title: productDoc.title,
        image: variantDoc?.images?.[0] || productDoc.images?.[0] || item.image || "",
        variant: { name: item.variant || "Standard" },
        material: { name: item.material || "" },
        color: { name: item.color || "Default" },
        leg: { name: item.leg || "" },
        firmness: { name: item.firmness || "" },
        footstool: { name: item.footstool || "" },
        coffeeTable: { name: item.coffeeTable || "" },
        sku: variantDoc?.sku || item.sku || "",
        quantity: Number(item.quantity) || 1,
        price: finalSecurePrice,
      };
    }));

    let totalPrice = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    if (assemblyService) {
      totalPrice += 50;
    }

    const address = {
      postcode: (shippingAddress?.postalCode || '').substring(0, 10),
      town: (shippingAddress?.city || '').substring(0, 30),
      street_name: (shippingAddress?.address || '').replace(/,/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 60),
    };

    const costOfGoods = (totalPrice).toFixed(2);
    
    const frontend_url = req.headers.origin || process.env.FRONTEND_URL || "http://localhost:5173";
    const backend_url = process.env.BACKEND_URL || "http://localhost:8000";

    const newOrder = new Order({
      user: resolvedUser ? resolvedUser._id : undefined,
      items: orderItems,
      totalPrice,
      shippingAddress: {
        fullName: shippingAddress?.fullName || "Guest Customer",
        phone: shippingAddress?.phone || "",
        address: shippingAddress?.address || "",
        city: shippingAddress?.city || "",
        postalCode: shippingAddress?.postalCode || "",
        country: shippingAddress?.country || "GB",
      },
      assemblyService: Boolean(assemblyService),
      paymentMethod: "PayItMonthly",
      paymentStatus: "pending",
      orderStatus: "processing",
      notes: deliveryDate ? `Delivery Date: ${deliveryDate}` : "",
    });
    
    await newOrder.save();

    const nameParts = (shippingAddress?.fullName || 'Customer').trim().split(' ');
    let possibleTitle = nameParts[0];
    let title = "Mr"; // Default fallback
    let firstName = "Customer";
    let lastName = "Customer";

    const validTitles = ["Mr", "Mrs", "Miss", "Ms", "Dr"];
    if (validTitles.includes(possibleTitle)) {
      title = possibleTitle;
      nameParts.shift(); // Remove title from array
    }

    if (nameParts.length > 0) {
      firstName = nameParts[0].substring(0, 30);
    }
    if (nameParts.length > 1) {
      lastName = nameParts.slice(1).join(' ').substring(0, 30);
    }

    const payload = {
      config: {
        live_or_test: process.env.NODE_ENV === 'production' ? "LIVE" : "TEST",
        application_type: "INTEGRATION_FULL",
        redirect_pass_url: `${frontend_url}/success?orderId=${newOrder._id}`,
        redirect_fail_url: `${frontend_url}/cancel`,
        redirect_refer_url: `${frontend_url}/cancel`,
        redirect_cancel_url: `${frontend_url}/cancel`,
        customer_email: email || resolvedUser?.email || "customer@example.com",
        webhook_response_url: `${backend_url}/api/order/pim-webhook`
      },
      finance_details: {
        cost_of_goods: costOfGoods,
        deposit: "0.00",
        goods_description: "Furniture Order",
      },
      personal_details: {
        title: title, 
        first_name: firstName,
        last_name: lastName,
        date_of_birth: req.body.dateOfBirth || "1990-01-01", 
        mobile_number: (shippingAddress?.phone || '07000000000').replace(/[^0-9+]/g, '').substring(0, 15),
        address: address
      }
    };

    const pimResponse = await payItMonthlyService.createFinanceApplication(payload);

    newOrder.pimApplicationId = pimResponse.uuid;
    newOrder.pimReference = pimResponse.reference;
    await newOrder.save();

    res.status(200).json({
      success: true,
      url: pimResponse.finance_application_link,
      orderId: newOrder._id
    });

  } catch (error) {
    console.error('PayItMonthly Checkout Error:', error);
    res.status(500).json({ success: false, message: 'Failed to initialize PayItMonthly checkout' });
  }
};

const crypto = require('crypto');

exports.pimWebhookHandler = async (req, res) => {
  const rawBody = req.body.toString();

  // Parse JSON from unauthenticated incoming payload
  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (err) {
    return res.status(400).send("Invalid JSON");
  }

  const applicationUuid = event.application_uuid || event.uuid;

  if (!applicationUuid) {
    return res.status(400).send("No application UUID provided");
  }

  console.log('Received PIM Webhook Event. Verifying server-to-server for UUID:', applicationUuid);

  try {
    // SECURE SERVER-TO-SERVER VERIFICATION
    // Ignore the webhook payload's claims and fetch the single source of truth directly from PayItMonthly
    const applicationData = await payItMonthlyService.getFinanceApplication(applicationUuid);
    
    const order = await Order.findOne({ pimApplicationId: applicationUuid });
    
    if (order) {
      // The API response structure matches what the webhook would send, so we check `decision.outcome`
      const outcome = applicationData.decision?.outcome;
      
      if (outcome === 'SUCCESS') {
        // Only send if it wasn't already paid to prevent duplicate emails
        const wasPending = order.paymentStatus === 'pending';
        
        order.paymentStatus = 'paid';
        order.orderStatus = 'confirmed';
        
        if (wasPending) {
          const { sendOrderConfirmationEmail } = require('../../Utils/emailService');
          const User = require('../../Schemas/User');
          
          let finalEmail = applicationData.personal_details?.email || applicationData.email || "eliteseating152@gmail.com";
          if (order.user) {
            const userDoc = await User.findById(order.user);
            if (userDoc) finalEmail = userDoc.email;
          }
          if (finalEmail) {
            sendOrderConfirmationEmail(finalEmail, order).catch(err => console.log("Email error:", err));
          }
          
          // Clear cart if user exists
          if (order.user) {
            const Cart = require('../../Schemas/Cart');
            await Cart.findOneAndDelete({ user: order.user });
          }
        }
      } else if (outcome === 'FAILED' || outcome === 'RECALLED' || outcome === 'CANCELLED') {
        order.paymentStatus = 'failed';
        order.orderStatus = 'cancelled';
      }
      
      await order.save();
    }
    
    res.status(200).send('OK');
  } catch (err) {
    console.error('PIM Webhook Processing/Verification Error:', err.message);
    res.status(500).send('Internal Server Error');
  }
};
