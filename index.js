const express = require('express');
const cors = require('cors');
const app = express()
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// Middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.PASSWORD}@cluster0.hvqv2xi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const servicesCollection = client.db('assignment11').collection('services');
        const reviewsCollection = client.db('assignment11').collection('reviews');
        app.get('/homeService', async (req, res) => {
            const query = {}
            const cursor = await servicesCollection.find(query)
            const services = await cursor.limit(3).toArray()
            res.send(services)
        })
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = await servicesCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query)
            res.send(service)
        })
        app.get('/reviews', async (req, res) => {
            const reqEmail = req.query.name;
            const query = { email: reqEmail };
            const cursor = await reviewsCollection.find(query);
            const userReviews = await cursor.toArray()
            res.send(userReviews)
        })
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { serviceId: id };
            const cursor = await reviewsCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews)
        })

        app.get('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const reviews = await reviewsCollection.findOne(query)
            res.send(reviews)
        })

        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true }
            const updateDocs = {
                $set: {
                    description: req.body.reviews
                }
            }
            const updateReviews = await reviewsCollection.updateOne(query, updateDocs, options)
            res.send(updateReviews)
        })
        app.post('/reviews', async (req, res) => {
            const info = req.body;
            const reviews = await reviewsCollection.insertOne(info)
            res.send(reviews)
        })
        app.post('/services', async (req, res) => {
            const serviceInfo = req.body;
            const service = await servicesCollection.insertOne(serviceInfo);
            res.send(service)
        })
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const reviews = await reviewsCollection.deleteOne(query)
            res.send(reviews)
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

