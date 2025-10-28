// backend/connect-test.js
require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
console.log('Using MONGO_URI =>', JSON.stringify(uri));

(async () => {
  try {
    const conn = await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB:', conn.connection.host);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Connect error:', err.message);
    // full details (optional)
    // console.error(err);
    process.exit(1);
  }
})();
