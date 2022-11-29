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

const addProfile = async (uId, name, email, password) => {
    const query = 'INSERT INTO profile(uId, name, email, password) VALUES ($1, $2, $3, $4);';
    const values = [uId, name, email, password];
    const result = await pool.query(query, values);
    return result;
};

const deleteProfile = async (uId) => {
  const query = 'DELETE FROM profile WHERE uid = $1;';
  const values = [uId];
  const result = await pool.query(query, values);
  return result;
};

const updateProfile = async (uId, name, email, password) => {
    const query = 'UPDATE profile SET uid = $1, name = $2, email = $3, password = $4 WHERE uid = $1;';
    const values = [uId, name, email, password];
    const result = await pool.query(query, values);
    return result;
  };

const getProfile = async (uId) => {
  const query = 'SELECT uid, name, email, password FROM profile WHERE tag = $1;';
  const values = [uId];
  const result = await pool.query(query, values);
  return result;
};

const getProfiles = async () => {
  const query = 'SELECT uid FROM profile;';
  const result = await pool.query(query, values);
  return result;
};

export { getProfiles, getProfile, updateProfile, addProfile, deleteProfile };