const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
//  dot env require
require('dotenv').config();

// object id database 
const ObjectId = require("mongodb").ObjectId;

// cors require
const cors = require("cors");

// middle ware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l5n9e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(req, res) {
    try {
        await client.connect();
        console.log("connected db");
        const database = client.db("travelGuru");
      const servicesCollection = database.collection("services");
      const customersCollection = database.collection("customers");

      // Get Single Services
      app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) }
        const singleService = await servicesCollection.findOne(query)
        res.json(singleService);
      })
      
      // POST API Services
      app.post('/services', async (req, res) => {
        const services = req.body;
        // console.log("hitted cliend", services);
        const result = await servicesCollection.insertOne(services);
        console.log("added services", result);
        res.send(result);
      });

      // POST API CUSTOMERS
      app.post('/customers', async (req, res) => {
        const coustomer = req.body;
        console.log("Hitting Order Parches", coustomer);
        const result = await customersCollection.insertOne(coustomer)
        res.send(result)
      })

      // GET ALL CUSTOMER
      app.get('/customers', async (req, res) => {
        const customers = customersCollection.find({})
        const result = await customers.toArray();
        res.send(result)
        })

      // GET MY Orders
      app.get('/customers/:email', async (req, res) => {
        const customerOder = customersCollection.find({ email: req.params.email })
        const result = await customerOder.toArray();
        res.send(result);
      })

      // GET API ALL SERVICES
      app.get('/services', async (req, res) => {
        const allServices = servicesCollection.find({})
        const result = await allServices.toArray();
        res.send(result)
      })
      // DETETE ORDERS
      app.delete("/customers/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) }
        const result = await customersCollection.deleteOne(query)
        res.json(result)
      })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Tavel-guru srver Running')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})