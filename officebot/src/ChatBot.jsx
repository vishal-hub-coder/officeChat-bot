import React, { useState } from 'react';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userId] = useState('user1');
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async (userText) => {
    const messageText = userText || input.trim();
    if (!messageText) return;

    setMessages((prev) => [...prev, { from: 'user', text: messageText }]);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message: messageText }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: data.message, options: data.options || [] }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: 'Server error. Please try again later.' }
      ]);
    }

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
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
            <button onClick={() => setIsOpen(false)}>×</button>
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
              onKeyPress={handleKeyPress}
            />
            <button onClick={() => sendMessage()}>Send</button>
          </div>
        </div>
      )}

     
    </div>
  );
};

export default ChatBot;
