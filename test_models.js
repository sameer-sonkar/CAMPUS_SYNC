try {
  const models = require('../backend/models/index.js');
  console.log('Models loaded successfully:', Object.keys(models));
} catch (e) {
  console.error('Error loading models:', e);
}
