import React, { useState } from 'react';
import axios from 'axios';
const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userId] = useState('user1');
  const [isOpen, setIsOpen] = useState(false);


const sendMessage = async (userText) => {
  const messageText = userText?.trim();
  if (!messageText) return;

  setMessages((prev) => [...prev, { from: 'user', text: messageText }]);

  try {
    const res = await axios.post('http://localhost:5000/api/chat', {
      userId,
      message: messageText
    });

    const data = res.data;

    setMessages((prev) => [
      ...prev,
      { from: 'bot', text: data.message, options: data.options }
    ]);
  } catch (err) {
    setMessages((prev) => [
      ...prev,
      { from: 'bot', text: 'Error: ' + err.message }
    ]);
    console.error("Server error:", err);
  }

  setInput('');
};












 

  const handleOptionClick = (option) => {
    sendMessage(option);
  };

  return (
    <div className="chatbot-wrapper">
      {!isOpen && (
        <div className="chatbot-icon" onClick={() => setIsOpen(true)}>
          
        </div>
      )}

      {isOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <span>ChatBot</span>
            <button onClick={() => setIsOpen(false)}>x</button>
          </div>

          <div className="chat-box">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.from}`}>
                <p>{msg.text}</p>
                {msg.options?.length > 0 && (
                  <div className="options">
                    {msg.options.map((opt, index) => (
                      <button key={index} onClick={() => handleOptionClick(opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your email or question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              
            />
            <button onClick={() => sendMessage(input)}>Send</button>
          </div>
        </div>
      )}

     
    </div>
  );
};

export default ChatBot;
