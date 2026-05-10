const Newsletter = require("../../Schemas/Newsletter");

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "You are already part of our elite circle." });
    }

    const newSubscriber = new Newsletter({ email });
    await newSubscriber.save();

    res.status(201).json({ 
      success: true, 
      message: "Welcome to the EliteSeating inner circle. You will now receive our latest curations." 
    });
  } catch (error) {
    console.error("Newsletter Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.status(200).json({ success: true, subscribers });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    const subscriber = await Newsletter.findByIdAndDelete(id);
    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }
    res.status(200).json({ success: true, message: "Subscriber removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
