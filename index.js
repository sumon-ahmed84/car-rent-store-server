const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://Car-rent-DB:YSZF06ecNMLfPUf5@cluster0.xhsdu7s.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("car_rent_db");
    const carCollection = db.collection("all_cars");
    const bookingCollection = db.collection("bookings");

    app.get("/all_cars", async (req, res) => {
      const result = await carCollection.find().toArray();
      res.send(result);
    });

    app.get("/all_cars/:id", async (req, res) => {
      const { id } = req.params;
      const query = new ObjectId(id);
      const result = await carCollection.findOne({ _id: query });
      res.send({
        success: true,
        result,
      });
    });

    app.get("/FeaturedCars", async (req, res) => {
      const query = carCollection.find().sort({ created_at: -1 }).limit(6);
      const result = await query.toArray();
      res.send({
        success: true,
        result,
      });
    });

    app.post("/all_cars", async (req, res) => {
      const newCar = req.body;
      const result = await carCollection.insertOne(newCar);
      res.send({
        success: true,
        result,
      });
    });

    app.get("/my_cars", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await carCollection.find(query).toArray();
      res.send({
        success: true,
        result,
      });
    });

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send({
        success: true,
        result,
      });
    });

    app.get("/my_bookings", async (req, res) => {
      const email = req.query.email;
      const query = {
        boking_by: email,
      };
      const result = await bookingCollection.find(query).toArray();
      res.send({
        success: true,
        result,
      });
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Car rental server is running");
});

app.listen(port, () => {
  console.log(`Car rental server listening on port : ${port}`);
});
