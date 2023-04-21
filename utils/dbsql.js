import mysql from 'mysql';

const dbsql = mysql.createConnection({
  host: 'localhost',
  user: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  database:'ecommerce',
});

export default dbsql;