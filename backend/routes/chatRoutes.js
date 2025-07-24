const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

const userState = {};
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const mainOptions = [
  "About Company", "Contact Us", "Speak to an Agent",
  "Choose more options", "FAQ", "Give Feedback", "Reset"
];

const moreOptions = ["Leave Policy", "Holiday List", "Work Timings"];
const faqOptions = ["Career Opportunities", "Office Locations"];

router.post('/', async (req, res) => {
  try {
    const { userId, message } = req.body;
    if (!userId || !message) {
      return res.json({ message: "User ID and message are required." });
    }

    if (!userState[userId]) {
      userState[userId] = {
        loggedIn: false,
        step: "start",
        email: null,
        lastActive: Date.now()
      };
    }

    const state = userState[userId];
    const msg = message.trim().toLowerCase();
    state.lastActive = Date.now(); 

    await Chat.create({ sender: 'user', message, email: state.email });

    if (msg === "reset") {
      userState[userId] = {
        loggedIn: false,
        step: "start",
        email: null,
        lastActive: Date.now()
      };
      const resetReply = { message: "Session has been reset. Please login again with your email." };
      await Chat.create({ sender: 'bot', message: resetReply.message, email: null });
      return res.json(resetReply);
    }





    if (msg === "hi" || msg === "hello") {
      state.step = "login";
      const reply = {
        message: "Hello! Please login by typing your email address.",
        loginRequired: true
      };
      await Chat.create({ sender: 'bot', message: reply.message, email: state.email });
      return res.json(reply);
    }

    if (!state.loggedIn && emailRegex.test(message)) {
      state.loggedIn = true;
      state.email = message;
      state.step = "main-menu";
      const reply = {
        message: `Login successful for ${message}. Choose an option:`,
        options: mainOptions
      };
      await Chat.create({ sender: 'bot', message: reply.message, email: message });
      return res.json(reply);
    }

    if (!state.loggedIn) {
      const reply = { message: "Please login using a valid email address." };
      await Chat.create({ sender: 'bot', message: reply.message, email: null });
      return res.json(reply);
    }

    if (msg.startsWith("feedback:")) {
      const feedbackMsg = message.slice(9).trim();
      await Chat.create({ sender: 'user-feedback', message: feedbackMsg, email: state.email });
      const reply = { message: "Thank you for your feedback! We appreciate it." };
      await Chat.create({ sender: 'bot', message: reply.message, email: state.email });
      return res.json(reply);
    }

    let botResponse = {};
    if (msg.includes("company") || msg.includes("about")) {
      botResponse = {
        message: "We are EstylishCart, founded in 2020, providing top-tier IT services.",
        options: mainOptions
      };
    } else if (msg.includes("contact")) {
      botResponse = {
        message: "Contact us at support@estylishcart.com or call 1234567890",
        options: mainOptions
      };
    } else if (msg.includes("agent") || msg.includes("support")) {
      botResponse = {
        message: "Please wait while we connect you to a live agent.",
        options: mainOptions
      };
    } else if (msg.includes("more options")) {
      state.step = "more-options";
      botResponse = {
        message: "Choose from more options:",
        options: moreOptions
      };
    } else if (msg.includes("faq")) {
      state.step = "faq";
      botResponse = {
        message: "Choose an FAQ option:",
        options: faqOptions
      };
    }
    else if (state.step === "more-options") {
      if (msg.includes("leave")) {
        botResponse = {
          message: "Our leave policy allows 15 paid leaves per year.",
          options: moreOptions
        };
      } else if (msg.includes("holiday")) {
        botResponse = {
          message: "We follow national holidays plus 5 optional company leaves.",
          options: moreOptions
        };
      } else if (msg.includes("timing") || msg.includes("work time")) {
        botResponse = {
          message: "Work timings are 9 AM to 6 PM, Monday to Friday.",
          options: moreOptions
        };
      } else {
        botResponse = {
          message: "Please choose from the available more options.",
          options: moreOptions
        };
      }
    }

    // else if (state.step === "faq") {
    //   if (msg.includes("career")) {
    //     botResponse = {
    //       message: "Visit estylishcart.com/careers to explore job openings.",
    //       options: faqOptions
    //     };
    //   } else if (msg.includes("location") || msg.includes("office")) {
    //     botResponse = {
    //       message: "Our offices are located in Delhi, Bangalore, and Pune.",
    //       options: faqOptions
    //     };
    //   } else {
    //     botResponse = {
    //       message: "Please choose a valid FAQ option.",
    //       options: faqOptions
    //     };
    //   }
    // }

    else {
      botResponse = {
        message: "I didn't understand that. Please choose one of the available options.",
        options: state.step === "faq" ? faqOptions : state.step === "more-options" ? moreOptions : mainOptions
      };
    }

    await Chat.create({ sender: 'bot', message: botResponse.message, email: state.email });
    return res.json(botResponse);

  } catch (err) {
    console.error("Chat error:", err.message);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
