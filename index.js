const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.json());

require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@jscluster.n9s8s9n.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        const servicesCollection = client.db("fixPC").collection("services");
        const reviewsCollection = client.db("fixPC").collection("reviews");

        app.get("/home", async (req, res) => {
            const limitCursor = servicesCollection.find({}).limit(3);
            const limitServices = await limitCursor.toArray();
            res.send(limitServices);
        });

        app.get("/services", async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();

            res.send(services);
        });

        app.get("/services/:id", async (req, res) => {
            const query = { _id: ObjectId(req.params.id) };
            const service = await servicesCollection.findOne(query);

            res.send(service);
        });

        app.get("/reviews", async (req, res) => {
            const query = { email: req.query.email };
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();

            res.send(reviews);
        });

        //filtering all reviews by service id (will show only reviews for that service)
        app.get("/reviews/:id", async (req, res) => {
            const query = { service_id: req.params.id };
            const cursor = reviewsCollection.find(query);
            const review = await cursor.toArray();

            res.send(review);
        });

        app.get("/reviews/:id", async (req, res) => {
            const query = { _id: ObjectId(req.params.id) };
            const review = await reviewsCollection.findOne(query);

            res.send(review);
        });

        app.patch("/reviews/:id", async (req, res) => {
            const query = { _id: ObjectId(req.params.id) };
            const updatedDoc = {
                $set: {
                    text: req.body.text,
                },
            };
            const review = await reviewsCollection.updateOne(query, updatedDoc);

            res.send(review);
        });

        app.delete("/reviews/:id", async (req, res) => {
            const query = { _id: ObjectId(req.params.id) };
            const result = await reviewsCollection.deleteOne(query);

            res.send(result);
        });

        app.post("/reviews", async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.send(result);
        });

        app.post("/services", async (req, res) => {
            const addedService = req.body;
            const result = await servicesCollection.insertOne(addedService);
            res.send(result);
        });
    } finally {
        //nothing
    }
}

run().catch((error) => console.error(error));

app.get("/", (req, res) => {
    res.send("FixPC Server is running...");
});

app.listen(port, () => {
    console.log(`FixPC Server is running at port ${port}`);
});
