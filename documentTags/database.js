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

const addTag = async (fileId, tag) => {
    const query = 'INSERT INTO tag(tag, fileId) VALUES ($2, $1);';
    const values = [fileId, tag];
    const result = await pool.query(query, values);
    return result;
};

const removeFile = async (fileId) => {
  const query = 'DELETE FROM tag WHERE fileId = $1;';
  const values = [fileId];
  const result = await pool.query(query, values);
  return result;
};

const removeTag = async (fileId, tag) => {
    const query = 'DELETE FROM tag WHERE fileId = $1 AND tag = $2;';
    const values = [fileId, tag];
    const result = await pool.query(query, values);
    return result;
  };

const getFiles = async (tag) => {
  const query = 'SELECT fileId FROM tag WHERE tag = $1;';
  const values = [tag];
  const result = await pool.query(query, values);
  return result;
};

const getTags = async () => {
  const query = 'SELECT tag FROM tag;';
  const result = await pool.query(query, values);
  return result;
};

export { getFiles, removeFile, getTags, addTag, removeTag };