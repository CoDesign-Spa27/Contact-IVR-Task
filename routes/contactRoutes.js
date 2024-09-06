const express = require('express');
const {
  createContact,
  getContact,
  updateContact,
  deleteContact
} = require('../controllers/contactController');

const router = express.Router();

router.post('/createContact', createContact);
router.post('/getContact', getContact);
router.post('/updateContact', updateContact);
router.post('/deleteContact', deleteContact);

module.exports = router;
