const mysql = require('mysql2/promise');
require('dotenv').config();
 
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: 22365,
});

 
async function createTableIfNotExists() {
  const connection = await pool.getConnection();
  
  try {
   
    const [rows] = await connection.query(
      `CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        email VARCHAR(255),
        mobile_number VARCHAR(255)
      )`
    );
    console.log("Table 'contacts' ensured");
  } catch (err) {
    console.error('Error creating table:', err.message);
  } finally {
    connection.release();  
  }
}

 
pool.getConnection()
  .then(() => {
    console.log('Connected to MySQL');
    return createTableIfNotExists();  
  })
  .catch(err => {
    console.error('MySQL connection error: ', err.message);
  });

module.exports = pool;
