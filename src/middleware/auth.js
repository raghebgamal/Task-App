const jwt = require("jsonwebtoken");
const User = require("./../models/user")
const Task=require("./../models/task")

const promisy = async (token) => jwt.verify(token, "ragheb111");

exports.Protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            res.status(404).json({  message: "plz authonticate" })

        }
        const decoded = await promisy(token);
        
        const user = await User.findOne({ _id: decoded._id, "tokens.token": token });
        
        if (!user) {
           res.status(404).json({  message: "plz authonticate" })

        }


        req.token = token;
             req.user = user;
             next();


    } catch (err) {
        console.log(err)
        res.status(404).json({ err, message:"plz authonticate"
})
        
    }
    
}


exports.deleteOther = async function (req, res, next) {
    const task = await Task.deleteMany({ owner: req.user._id })
    console.log(task);
    
    next();
}