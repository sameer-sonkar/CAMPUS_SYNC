const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { 
  serverSelectionTimeoutMS: 5000 // timeout quickly to see the error
})
.then(() => { 
  console.log("✅ SUCCESS"); 
  process.exit(0); 
})
.catch(err => { 
  console.error("❌ ERROR:", err.message); 
  process.exit(1); 
});
