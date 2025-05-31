const {
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
} = require("./database");

const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors({
  origin: "https://sparkly-maamoul-842dc9.netlify.app/", 
  credentials: true
}));

app.use(express.json());

const path = require("path");
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);
app.use(
  "/assets",
  express.static(path.join(__dirname, "../client/dist/assets"))
);

const isLoggedIn = async (req, res, next) => {
  try {
    req.user = await findUserByToken(req.headers.authorization);
    next();
  } catch (ex) {
    next(ex);
  }
};

app.post("/api/auth/login", async (req, res, next) => {
  try {
    res.send(await authenticate(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/auth/me", isLoggedIn, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/cookies", async (req, res, next) => {
  try {
    res.send(await fetchProducts());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/users", async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/users/:id/userProducts", isLoggedIn, async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id) {
      const error = Error("not authorized");
      error.status = 401;
      throw error;
    }
    res.send(await fetchUserProducts(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

app.delete(
  "/api/users/:userId/userSkills/:id",
  isLoggedIn,
  async (req, res, next) => {
    try {
      if (req.params.userId !== req.user.id) {
        const error = Error("not authorized");
        error.status = 401;
        throw error;
      }
      await deleteUserProduct({ user_id: req.params.userId, id: req.params.id });
      res.sendStatus(204);
    } catch (ex) {
      next(ex);
    }
  }
);

app.post("/api/users/:id/userProducts", isLoggedIn, async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id) {
      const error = Error("not authorized");
      error.status = 401;
      throw error;
    }
    res.status(201).send(
      await createUserProduct({
        user_id: req.params.id,
        product_id: req.body.product_id,
      })
    );
  } catch (ex) {
    next(ex);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message || err });
});

app.post("/api/auth/register", async (req, res, next) => {
  try {
    const { username, password, name, mailing_address } = req.body;

    const user = await createUser({ username, password, name, mailing_address });
    const token = await authenticate({ username, password });
    console.log("created user", user);
    res.send({ token, user });
  } catch (err) {
    next(err);
  }
});

const init = async () => {
  console.log("connecting to database");
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("tables created");

  const [jade, nicole, keila, taylor, Smores_Cookie, Key_Lime_Pie_Cookie, Oreo_Cookie, Banana_Peanut_Cookie] =
    await Promise.all([
      createUser({ username: "jade", password: "jade_nc", name: "Jade", mailing_address: "160 Hyde Ave" }),
      createUser({ username: "keila", password: "keila_wu", name: "Keila", mailing_address: "12649 Bluestem St" }),
      createUser({ username: "nicole", password: "nicole_dog", name: "Nicole", mailing_address: "937 Helderberg Ave" }),
      createUser({ username: "taylor", password: "taylor_gf", name: "Taylor", mailing_address: "28368 Duansberg St" }),
      createProducts({ name: "Smore's Cookie", description: "Sourdough discard sugar cookies with a layer of marshmallow coated in graham crackers topped with whipped chocolate frosting.", img_url: "/smores.jpeg", price: 1.25 }),
      createProducts({ name: "Key Lime Pie Cookie", description: "Sourdough discard shortbread cookies with key lime whipped frosting.", img_url: "/key.jpeg", price: 1.25 }),
      createProducts({ name: "Oreo Cookie", description: "Sourdough discard sugar cookies with oreo whipped frosting.", img_url: "/oreo.jpeg", price: 1.25 }),
      createProducts({ name: "Banana Peanut Cookie", description: "Sourdough discard peanut butter cookies with a layer of chocolate topped with whipped banana pudding frosting.", img_url: "/peanut.jpeg", price: 1.25 }),
    ]);

  console.log(await fetchUsers());
  console.log(await fetchProducts());

  const userProducts = await Promise.all([
    createUserProduct({ user_id: jade.id, product_id: Smores_Cookie.id, quantity: 3 }),
    createUserProduct({ user_id: nicole.id, product_id: Key_Lime_Pie_Cookie.id, quantity: 1 }),
    createUserProduct({ user_id: keila.id, product_id: Oreo_Cookie.id, quantity: 7 }),
    createUserProduct({ user_id: taylor.id, product_id: Banana_Peanut_Cookie.id, quantity: 4 }),
  ]);
  console.log(await fetchUserProducts(jade.id));
  await deleteUserProduct({ user_id: jade.id, id: userProducts[0].id });
  console.log(await fetchUserProducts(jade.id));

  console.log("data seeded");

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
