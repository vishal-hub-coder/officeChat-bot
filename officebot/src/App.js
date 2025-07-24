import React from 'react';
import ChatBot from './ChatBot';

const App = () => {
  return (
    <div className="app-container">
   
      <header className="main-header">
        <h1>Welcome to Office Portal</h1>
        <p>This is your central place for accessing office services and information.</p>
      </header>

      <main className="main-content">
        <section>
          <h2>About Our Company</h2>
          <p>We are dedicated to providing the best services for our employees and customers.</p>
        </section>
        <section>
          <h2>Contact Information</h2>
          <p>Email: support@company.com | Phone: +1234567890</p>
        </section>
      </main>
      <ChatBot />

      <style>{`
        .app-container {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        .main-header {
          background: #3f51b5;
          color: white;
          padding: 20px;
          border-radius: 10px;
        }
        .main-content {
          margin-top: 20px;
        }
        section {
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default App;
