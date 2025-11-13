const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;


require("dotenv").config()

const admin = require("firebase-admin");

const serviceAccount = require("./firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.xhsdu7s.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
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


     app.get("/toprated", async (req, res) => {
      const query = carCollection.find().sort({ rating: -1 }).limit(6);
      const result = await query.toArray();
      console.log(result);
      
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
  const query = { booking_by: email };
  const result = await bookingCollection.find(query).toArray();
  res.send({ success: true, result });
});

    app.get("/search", async (req, res) => {
      const search_text = req.query.search;
      const result = await carCollection.find({ name: { $regex: search_text, $options: "i" } }).toArray();
      res.send({
        success: true,
        result,
      });
    });


    app.put("/all_cars/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ success: false, message: "Invalid car ID" });
      }

      if (!data || Object.keys(data).length === 0) {
        return res.status(400).send({ success: false, message: "No update data provided" });
      }

      const query = { _id: new ObjectId(id) };
      const updateDoc = { $set: data };
      const result = await carCollection.updateOne(query, updateDoc);

      if (result.matchedCount === 0) {
        return res.status(404).send({ success: false, message: "Car not found" });
      }

      res.send({
        success: true,
        message: "Car updated successfully",
        result,
      });
    });



     app.delete("/all_cars/:id", async (req, res) => {
      const {id}=req.params;
      const result = await carCollection.deleteOne({_id: new ObjectId(id)});
      res.send({
        success: true,
        result,
      });
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Car rental server is running");
});

app.listen(port, () => {
  console.log(`Car rental server listening on port : ${port}`);
});
