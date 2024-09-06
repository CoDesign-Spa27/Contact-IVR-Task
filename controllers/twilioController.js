const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendIVRCall = async (req, res) => {
  try {
    const { to } = req.body; 
    console.log("called")
    const call = await client.calls.create({
      url: 'https://b6cf-2401-4900-889a-4d99-f906-7d40-cca6-58b1.ngrok-free.app/twilio/ivr-response',
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
    
    res.json({ message: 'Call initiated', sid: call.sid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const handleIVRResponse = (req, res) => {
    const twiml = new twilio.twiml.VoiceResponse();
   console.log("handeling reponse")
    twiml.gather({
      numDigits: 1,
      action: '/twilio/process-ivr-response',
      method: 'POST',
    }).say('Press 1 to receive your interview link.');
  
    res.type('text/xml');
    res.send(twiml.toString());
  };
  
  const processIVRResponse = async (req, res) => {
    const twiml = new twilio.twiml.VoiceResponse();
    console.log('Received request body:', req.body); 
    
    const digit = req.body.Digits;
    console.log('Received digit:', digit);  
    
    if (digit === '1') {
      try {
        const message = await client.messages.create({
          body: 'Here is your interview link: https://v.personaliz.ai/?id=9b697c1a&uid=fe141702f66c760d85ab&mode=test',
          from: process.env.TWILIO_PHONE_NUMBER,
          to: '+918290833651'
        });
        twiml.say('Interview link has been sent to your phone via SMS. Thank you for using our service. Goodbye!');
        console.log('SMS sent:', message);
      } catch (error) {
        console.error('Error sending SMS:', error);
        twiml.say('We encountered an error while sending the SMS. Please try again later.');
      }
    } else {
      twiml.say('Invalid input received. Thank you for using our service. Goodbye!');
    }
  
    res.type('text/xml');
    res.send(twiml.toString());
  };
  
module.exports = {
  sendIVRCall,
  handleIVRResponse,
  processIVRResponse
};
