const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express()
require('dotenv').config();
const cors = require('cors')
const port = process.env.PORT ||5000;

app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d54lo.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });







async function run() {
  try {
    await client.connect();
    const productCollection = client.db("productList").collection("product");

      // get api for product
   
      
      // create api for product 


      // update api for product 


      //delete api for product


    console.log('Db connected');

  } finally {
    // await client.close();
  }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Yeeee! I start to the Server.I con not know how to work the server. it was working')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})