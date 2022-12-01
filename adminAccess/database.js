import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "team0",
    password: "",
    port: 5432,
});

await pool.connect();

const addUser = async (uId) => {
    const query = 'INSERT INTO admin(uid, value) VALUES ($1, TRUE);';
    const values = [uId];
    const result = await pool.query(query, values);
    return result;
};

const removeUser = async (uId) => {
  const query = 'DELETE FROM admin WHERE uid = $1;';
  const values = [uId];
  const result = await pool.query(query, values);
  return result;
};

const getUsers = async () => {
  const query = 'SELECT * FROM admin;';
  const values = [];
  const result = await pool.query(query, values);
  return result;
};

const checkUser = async (uId) => {
  const query = 'SELECT COUNT(*) FROM admin WHERE uid = $1;';
  const values = [uId];
  const result = await pool.query(query, values);
  return result.rows[0].count > 0;
};

export { addUser, removeUser, getUsers, checkUser };