const Contact = require("../../Schemas/Contact");

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newContact = new Contact({
      name,
      email,
      phone,
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

exports.updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const message = await Contact.findByIdAndUpdate(id, { status }, { new: true });
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Contact.findByIdAndDelete(id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
