const Contact = require("../../Schemas/Contact");

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newContact = new Contact({
      name,
      email,
      subject,
      message,
    });

    await newContact.save();

    res.status(201).json({ 
      success: true, 
      message: "Your message has been sent to our concierge team." 
    });
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
