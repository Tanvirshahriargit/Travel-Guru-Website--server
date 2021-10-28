const express = require('express')
const app = express()
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

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l5n9e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(req, res) {
    try {
        await client.connect();
        console.log("connected db");
        const database = client.db("travelGuru");
        const usersCollection = database.collection("users");
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