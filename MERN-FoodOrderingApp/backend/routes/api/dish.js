const router = require("express").Router();
let Dish = require("../../models/dish.models");
const { response } = require("express");
const auth = require("../../util/auth");
router.get("/", async (req, res) => {
  try {
    const dishes = await Dish.find({});
    if(!dishes){
      return res.status(401).json({"message": "No dishes found"})
    }
    return res.json(dishes); // Send the list of dishes as JSON response
  } catch (err) {
    console.error('Error fetching all dishes:', err);
    return res.status(400).json({ error: "Error: " + err }); // Send an error response with status 400
  }
});

// GET CUISINE DISHES
router.get("/:cuisine", async (req, res) => {
  try {
    const cuisine = req.params.cuisine;
    if(!cuisine){
      return res.status(400).json({"message": "Cuisine is not defined"})
    }
    console.log(`Fetching dishes for cuisine: ${cuisine}`); // Logging for debugging
    const dishes = await Dish.find({ "cuisine": cuisine });
    if(!dishes){
      return res.status(401).json({"message": "Error while fetching the data"})
    }
    if (dishes.length === 0) {
      console.log(`No dishes found for cuisine: ${cuisine}`);
      return res.status(404).json({ message: `No dishes found for cuisine: ${cuisine}` });
    }

    return res.json(dishes);
  } catch (err) {
    console.error('Error fetching dishes:', err);
    return res.status(500).json({ error: "An error occurred while fetching dishes" });
  }
});

// POST NEW DISH
router.post("/new", async(request, response) => {
    const {dishName, cuisine, description, imageUrl, price, password}= req.body;
    if(!dishName || !cuisine || !description || !imageUrl || !price || !password){
      return res.status(401).json({"message": "Error while getting the data"});
    }
  if(password!="Arhaam123") {
    return response.status(401).json("UNAUTHORIZED!");
  }

  const newDish = new Dish({ dishName, cuisine, description, imageUrl, price });

  await newDish
    .save()
    .then(() => {
      response.json("Dish successfully added!");
    })
    .catch((err) => {
      response.status(400).json("Error: " + err);
    });
});

module.exports = router;
