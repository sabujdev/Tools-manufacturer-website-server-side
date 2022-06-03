const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors({origin:"https://scintillating-banoffee-d13d5b.netlify.app/"}));
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

      //add a new product to db
      app.post('/products', async (req, res) => {
        const result = await productsCollection.insertOne(req.body)
        res.json(result)
    })

    // delete product from db
    app.delete('/delete/:id', async (req, res) => {
        const result = await productsCollection.deleteOne({
            _id: ObjectId(req.params.id)
        })
        res.json(result)
    })

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

    // admin manage 
        // get all orders
        app.get('/all-orders', async (req, res) => {
          const result = await ordersCollection.find().toArray()
          res.json(result)
      })
      // update orders status
      app.put('/updateStatus/:id', async (req, res) => {
          const id = req.params.id
          const result = await ordersCollection.updateOne({
              _id: ObjectId(id)
          }, {
              $set: {
                  status: 'Approved',
              }
          })
          res.json(result);
      })
      app.put('/updateStatus1/:id', async (req, res) => {
          const id = req.params.id
          const result = await ordersCollection.updateOne({
              _id: ObjectId(id)
          }, {
              $set: {
                  status: 'on the way',
              }
          })
          res.json(result);
      })

    

      // make admin role 
      app.post('/users/admin', async (req, res) => {
        const user = req.body
        const result = await userCollection.insertOne(user)
        res.json(result)
    })
    //get admin user 
    app.get('/users/:email', async (req, res) => {
        const email = req.params.email
        const query = { email: email }
        const user = await userCollection.findOne(query)
        let isAdmin = false
        if (user?.role === 'admin') {
            isAdmin = true;
        }
        res.json({ admin: isAdmin })
    })

     // payment 

     app.get('/payment/:id', async (req, res) => {
      const id = req.params.id;
      const query = {
          _id: ObjectId(id)
      };
      const product = await ordersCollection.findOne(query);
      res.json(product);
  });

  // update order after payment successfull
  app.put('/payment/:id', async (req, res) => {
      const id = req.params.id;
      const payment = req.body;
      const filter = {
          _id: ObjectId(id)
      }
      const updateDoc = {
          $set: {
              payment: payment
          }
      }
      const result = await ordersCollection.updateOne(filter, updateDoc)
      res.json(result)
  })

  // add rating to db
  app.post('/rating', async (req, res) => {
    const result = await ratingCollection.insertOne(req.body)
    res.json(result)
})
app.get('/rating', async (req, res) => {
    const result = await ratingCollection.find().toArray()
    res.json(result)
})

  // payment method setup
  app.post('/create-payment-intent', async (req, res) => {
      const paymentInfo = req.body
      const amount = paymentInfo.price * 100
      const paymentIntent = await stripe.paymentIntents.create({
          currency: 'usd',
          amount: amount,
          payment_method_types: ['card']
      })
      res.json({
          clientSecret: paymentIntent.client_secret
      })
  })
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