const express = require('express');
const {
  sendIVRCall,
  handleIVRResponse,
  processIVRResponse
} = require('../controllers/twilioController');

const router = express.Router();

router.post('/sendIVRCall', sendIVRCall);
router.post('/ivr-response', handleIVRResponse);
router.post('/process-ivr-response', processIVRResponse);

module.exports = router;
