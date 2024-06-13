const router = require("express").Router();
let User = require("../../models/user.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../util/auth");

// GET ALL USERS
router.get("/", (request, result) => {
  try{
    const user= User.find({});
    if(!user){
       res.status(401).json({"message": "Error while getting the data"});
    }
     res.status(200).json({"message": "All teh data found Successfully", "data": user});
  }
  catch(err){
     res.status(500).json({"message": "Internal Server Error"});
  }
});

// POST NEW USER
router.post("/new", async (request, result) => {
  try{
    const {email, password, name, phoneNumber, address}= req.body;
    console.log(email, password,name,phoneNumber,address);
    if(!email || !password || !name || !phoneNumber || !address){
       result.status(401).json({"message": "All the fields are not defined"});
    }
    console.log("EMAIL: " + email)
    console.log("Going to create a new User");
    // Checking if user exists
    const user= await User.findOne({ email: `${email}` })
    if(user){
     res.status(401).json({"message": "User already registered"});
    }
    console.log("hello")
    // so the user does not exists and we are gonna to define the 
        // If user does not exist
          const newUser = new User({
            email,
            password,
            name,
            phoneNumber,
            address,
          });
          console.log("hey")
          // Create Salt & Hash
           const hash = await bcrypt.hash(newUser.password, 10);
            newUser.password = hash;
            console.log(hash);
            // Adding newUser to Database
           await  newUser.save();
                // response.json("User successfully added!");
                const userToken= jwt.sign({ id: user.id },"userToken",
                  {
                    expiresIn: 3600,
                  });
                     result.status(200).json({"token":
                      token,
                      "user": {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        phoneNumber: user.phoneNumber,
                        address: user.address,
                      },
                    });
  }
  catch(err){
     result.status(500).json({"message": "Internal Server Error"})
  }
        });

// POST EXISTING USER
router.post("/existing", async (request, result) => {
  try{
   const {email, password}= user.body;
   if(!email || !password){
     res.status(400).json({"message": "All the fields are not defined"})
   }
    // Checking if user exists
    const user= await User.findOne({ email: `${email}` });
    if(!user){
       res.status(401).json({"message": "Error while getting the data of the user"});
    }
         const match=  bcrypt.compare(password, password);
         if(match){
           result.status(400).json("Invalid credentials!");
         }
          const token=      jwt.sign({ id: user.id },"userToken",{"expiresIn": 3600} );

                    result.status(200).json({
                     "token": token,
                      "user": {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        phoneNumber: user.phoneNumber,
                        address: user.address,
                      },
                    });
                  }
                  catch(err){
                     res.status(500).json({"message": "Internal Server Error"})
                  }
                });

// UPDATE USER

// GET USER DATA (AUTHENTICATED)
router.get("/auth", auth, (request, result) => {
  User.findById(request.user.id)
    .select("-password")
    .then((user) => {
      result.json(user);
    })
    .catch((err) => {
      result.status(400).json("Error: " + err);
    });
});

module.exports = router;
