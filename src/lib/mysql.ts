import mysql from "mysql2/promise";

// Pool de conexão MySQL reutilizável (apenas para o Snapshot)
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT) || 5643,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  timezone: "+00:00",
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  connectTimeout: 30000,
});

export default pool;
