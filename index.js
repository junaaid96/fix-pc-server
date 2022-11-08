const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.get("/", (req, res) => {
    res.send("FixPC Server is running...");
});

app.listen(port, () => {
    console.log(`FixPC Server is running at port ${port}`);
});
