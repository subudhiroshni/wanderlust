require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("./models/listing"); // Ensure the correct path
const { sampleListings } = require("./init/data"); // Import the data from where it's stored

mongoose.connect(process.env.ATLASDB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log("Connected to MongoDB");

    try {
      // Insert the listings data in bulk
      const result = await Listing.insertMany(sampleListings);
      console.log(`${result.length} listings added successfully!`);
    } catch (error) {
      console.error("Error inserting listings:", error);
    } finally {
      // Close the connection
      mongoose.connection.close();
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error: ", err);
  });
