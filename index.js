const express = require('express');
const cors = require('cors');
const app = express()
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

// Middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.PASSWORD}@cluster0.hvqv2xi.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const servicesCollection = client.db('assignment11').collection('services');
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = await servicesCollection.find(query)
            const services = await cursor.limit(3).toArray()
            res.send(services)
        })
    }
    finally {

    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('Your website is running in web')
})

app.listen(port, () => {
    console.log('Your api is running', port)
})

