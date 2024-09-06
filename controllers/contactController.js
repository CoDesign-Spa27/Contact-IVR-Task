const axios = require('axios');
const pool = require('../config/db');
require('dotenv').config();

const createContact = async (req, res) => {
  const { first_name, last_name, email, mobile_number, data_store } = req.body;

  if (data_store === 'CRM') {
    try {
      const response = await axios.post(
        `https://${process.env.FRESHSALES_DOMAIN}/api/contacts`,
        {
          contact: {
            first_name, last_name, email, mobile_number
          }
        },
        {
          headers: { 'Authorization': `Token token=${process.env.FRESHSALES_API_KEY}` }
        }
      );
      return res.json(response.data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else if (data_store === 'DATABASE') {
    try {
      const [result] = await pool.query(
        'INSERT INTO contacts (first_name, last_name, email, mobile_number) VALUES (?, ?, ?, ?)',
        [first_name, last_name, email, mobile_number]
      );
      return res.json({ id: result.insertId });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

const getContact = async (req, res) => {
  const { contact_id, data_store } = req.body;

  if (data_store === 'CRM') {
    try {
      const response = await axios.get(
        `https://${process.env.FRESHSALES_DOMAIN}/api/contacts/${contact_id}`,
        {
          headers: { 'Authorization': `Token token=${process.env.FRESHSALES_API_KEY}` }
        }
      );
      return res.json(response.data.contacts);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else if (data_store === 'DATABASE') {
    try {
      const [rows] = await pool.query('SELECT * FROM contacts WHERE id = ?', [contact_id]);
      if (rows.length > 0) return res.json(rows[0]);
      return res.status(404).json({ message: 'Contact not found' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

const updateContact = async (req, res) => {
  const { contact_id, new_email, new_mobile_number, data_store } = req.body;

  if (data_store === 'CRM') {
    try {
      const response = await axios.put(
        `https://${process.env.FRESHSALES_DOMAIN}/api/contacts/${contact_id}`,
        {
          contact: {
            email: new_email,
            mobile_number: new_mobile_number
          }
        },
        {
          headers: { 'Authorization': `Token token=${process.env.FRESHSALES_API_KEY}` }
        }
      );
      return res.json(response.data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else if (data_store === 'DATABASE') {
    try {
      const [result] = await pool.query(
        'UPDATE contacts SET email = ?, mobile_number = ? WHERE id = ?',
        [new_email, new_mobile_number, contact_id]
      );
      return res.json({ message: 'Contact updated successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

const deleteContact = async (req, res) => {
  const { contact_id, data_store } = req.body;

  if (data_store === 'CRM') {
    try {
      await axios.delete(
        `https://${process.env.FRESHSALES_DOMAIN}/api/contacts/${contact_id}`,
        {
          headers: { 'Authorization': `Token token=${process.env.FRESHSALES_API_KEY}` }
        }
      );
      return res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else if (data_store === 'DATABASE') {
    try {
      await pool.query('DELETE FROM contacts WHERE id = ?', [contact_id]);
      return res.json({ message: `Contact deleted successfully ${contact_id}` });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = {
  createContact,
  getContact,
  updateContact,
  deleteContact
};
