const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || {host: "localhost", database: "e_commerce_database", port: 5432, ssl: false, user: "postgres"}
);
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT || "shhh";



const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS user_products;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      is_admin BOOLEAN DEFAULT FALSE,
      name VARCHAR(255) NOT NULL,
      email_address VARCHAR(255),
      mailing_address VARCHAR(255) NOT NULL,
      phone_number VARCHAR(255),
      billing_address VARCHAR(255)
    );
       CREATE TABLE products(
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    img_url VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL
    );
    CREATE TABLE user_products(
     id UUID PRIMARY KEY,
     user_id UUID NOT NULL,
     product_id UUID NOT NULL,
     quantity INTEGER NOT NULL,
     UNIQUE (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (product_id) REFERENCES Products(id)
    );
  `;
  await client.query(SQL);
};

const createUser = async ({ username, password, name, mailing_address }) => {
  const SQL = `
    INSERT INTO users(id, username, password, name, mailing_address) VALUES($1, $2, $3, $4, $5) RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    username,
    await bcrypt.hash(password, 5),
    name,
    mailing_address
  ]);
  return response.rows[0];
};

const createProducts = async ({ name, description, img_url, price }) => {
  const SQL = `
    INSERT INTO products(id, name, description, img_url, price) VALUES ($1, $2, $3, $4, $5) RETURNING * 
  `;

  const response = await client.query(SQL, [uuid.v4(), name, description, img_url, price]);
  return response.rows[0];
};

const authenticate = async ({ username, password }) => {
  const SQL = `
    SELECT id, password
    FROM users
    WHERE username = $1
  `;

  const response = await client.query(SQL, [username]);
  if (
    !response.rows.length ||
    (await bcrypt.compare(password, response.rows[0].password)) === false
  ) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: response.rows[0].id }, JWT);

  return { token };
};

const createUserProduct = async ({ user_id, product_id, quantity }) => {
  const SQL = `
    INSERT INTO user_products(id, user_id, product_id, quantity) VALUES ($1, $2, $3, $4) RETURNING * 
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, product_id, quantity]);
  return response.rows[0];
};

const fetchUsers = async () => {
  const SQL = `
    SELECT id, username 
    FROM users
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchProducts = async () => {
  const SQL = `
    SELECT *
    FROM products
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchUserProducts = async (user_id) => {
  const SQL = `
    SELECT *
    FROM user_products
    WHERE user_id = $1
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows;
};

const deleteUserProduct = async ({ user_id, id }) => {
  const SQL = `
    DELETE
    FROM user_products
    WHERE user_id = $1 AND id = $2
  `;
  await client.query(SQL, [user_id, id]);
};

const findUserByToken = async (token) => {
  const SQL = `
    SELECT id, username
    FROM users
    WHERE id = $1
  `;
  const { id } = await jwt.verify(token, JWT);

  const response = await client.query(SQL, [id]);
  if (!response.rows.length) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  return response.rows[0];
};

module.exports = {
  client,
  createTables,
  createUser,
  createProducts,
  fetchUsers,
  fetchUserProducts,
  createUserProduct,
  fetchProducts,
  deleteUserProduct,
  authenticate,
  findUserByToken,
};