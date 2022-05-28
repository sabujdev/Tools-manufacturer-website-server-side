const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d54lo.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productsCollection = client.db("Tools").collection("products");
    const ordersCollection = client.db("Tools").collection("orders");
    const ratingCollection = client.db("Tools").collection("reviews");
    const userCollection = client.db("Tools").collection("users");

    // get api for product
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
    // get by id Api
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: ObjectId(id),
      };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });

    // update api for product
    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const filter = {
        _id: ObjectId(id),
      };
      const updateDoc = {
        $set: {
          quantity: body,
        },
      };
      const result = await productsCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    // Order Api
    app.post("/orders", async (req, res) => {
      const product = await ordersCollection.insertOne(req.body);
      res.send(product);
    });

    // get single email ordered product
    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      const query = {
        email: email,
      };
      const result = await ordersCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/delete-order/:id", async (req, res) => {
      const result = await ordersCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.json(result);
    });

    //delete api for product

    console.log("Db connected");
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(
    "Yeeee! I start to the Server.I con not know how to work the server. it was working"
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
