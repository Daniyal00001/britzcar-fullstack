const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// DB connect
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/britzcar';
connectDB(MONGO_URI);

// Seed default admin
async function seedAdmin(){
  const count = await User.countDocuments();
  if (count === 0){
    const hash = await bcrypt.hash('Admin@123', 10);
    await User.create({ email: 'admin@example.com', password: hash, role: 'admin' });
    console.log('👤 Seeded admin: admin@example.com / Admin@123');
  }
}
seedAdmin();

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cars', require('./routes/cars'));
app.use('/api/sellcars', require('./routes/sellcars'));
app.use('/api/feedback', require('./routes/feedback'));

// Serve frontend

const publicDir = path.join(__dirname, '../public');
app.use(express.static(publicDir));

// Root path ko index.html do
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Baaki static files express.static se mil jayengi (cars.html, admin-login.html, etc.)



// const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));
app.get('*', (req, res) => {
  const filePath = path.join(publicDir, req.path);
  res.sendFile(filePath, err => {
    if (err) res.status(404).send('Not found');
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));
