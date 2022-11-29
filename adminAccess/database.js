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
  const query = 'SELECT uid FROM admin;';
  const values = [uId];
  const result = await pool.query(query, values);
  return result;
};

const checkUser = async (uId) => {
  const query = 'SELECT exists(SELECT 1 FROM admin WHERE uid = $1);';
  const values = [uId];
  const result = await pool.query(query, values);
  return result;
};

export { addUser, removeUser, getUsers, checkUser };