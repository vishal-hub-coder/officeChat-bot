const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRoutes);

mongoose.connect('mongodb+srv://vishal123:vishal123@cluster0.greflbq.mongodb.net/?retryWrites=true&w=majority&appName=chatbots')
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
