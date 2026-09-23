const mysql=require('mysql2/promise');
async function r(){
    const p=mysql.createPool({host:process.env.MYSQL_HOST, user:process.env.MYSQL_USER, password:process.env.MYSQL_PASSWORD, database:process.env.MYSQL_DATABASE, port:process.env.MYSQL_PORT});
    const [rows]=await p.query("SELECT * FROM tbbalanceteresumo LIMIT 5");
    console.log(rows);
    process.exit(0);
}
r();
