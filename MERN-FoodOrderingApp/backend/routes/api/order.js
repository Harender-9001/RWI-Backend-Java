const router = require("express").Router();
let Order = require("../../models/order.models");
let Dish = require("../../models/dish.models");
const { response } = require("express");
const auth = require("../../util/auth");

// GET ALL ORDERS
router.get("/", auth,async (request, response) => {
try{
 const order=await Order.find({});
   if(!order){
    return response.status(400).json("Error: " + err);
   }
 return res.status(200).json({"message": "Data Fetched Succesfully", "data": order})  
}
catch(err){
  return res.status(500).json({"message": "Internal Server Error"})
}
});

// GET USER ORDERS
router.get("/:userEmail", auth,async (request, response) => {
  try{
    const userEmail = request.params.userEmail;
    const order= await Order.find({userEmail});
    if(!order){
      return res.status(400).json({"message": "Error while finding the data"});
    }
  return res.status(200).json({"message": "Data Fetched Successfully", "data": order})
  }
  catch(err){
    return res.status(500).json({"message": "Error while Fetching the data"});
  }
  });

// POST NEW ORDER
router.post("/new", auth, async (request, response) => {
  try{
    const dishNames = request.body.dishNames;
    var dishes = [];
  
    // forEach is NOT async
    // for..of IS async, it will wait
    for (const d of dishNames) {
      //   Getting dish details
      await Dish.findOne({ dishName: `${d}` })
        .then((dish) => {
          dishes.push(dish);
          console.log(dish.dishName);
        })
        .catch((err) => {
          console.log("Error: " + err);
        });
    }
  
    const totalCost = request.body.totalCost;
    const userEmail = request.body.userEmail;
    const date = Date.now();
    console.log(dishes);
  
    const newOrder = new Order({ dishes, totalCost, userEmail, date });
  
   await  newOrder.save();
   return res.status(200).json({"message": "Order Added Successfully"})
  }
  catch(err){
    return res.status(500).json({"message": "Internal Server Error"})
  }
});

module.exports = router;
