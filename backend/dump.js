require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');

async function dump() {
  await mongoose.connect(process.env.MONGO_URI);
  const { Timetable } = require('./models');
  const tt = await Timetable.findOne({ docId: 'CSE_2024-2028' });
  console.log('TIMETABLE', JSON.stringify(tt, null, 2));
  process.exit(0);
}
dump();
