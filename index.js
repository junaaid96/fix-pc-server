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
        const database = client.db("fixPC").collection("services");

        app.get("/services", async (req, res) => {
            const query = {};
            const cursor = database.find(query);
            const services = await cursor.toArray();

            res.send(services);
        });

        app.get("/services/:id", async (req, res) => {
            const query = { _id: ObjectId(req.params.id) };
            // console.log(query);
            const service = await database.findOne(query);

            res.send(service);
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
