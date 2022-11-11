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
            // console.log(query);
            const service = await servicesCollection.findOne(query);

            res.send(service);
        });

        app.get("/reviews", async (req, res) => {
            let query = {};

            req.query.email && (query = { email: req.query.email });

            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();

            res.send(reviews);
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
