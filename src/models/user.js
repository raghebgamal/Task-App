const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const Task=require("./../models/task")
require("./../db/mongoose");
const validator = require('validator');
const jwt=require("jsonwebtoken")
const userSchema =new mongoose.Schema({
    name: {
        
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        unique:true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("email is not valid");
            }
        }
    },
    age: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error("age must > 0");
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minLength: 6,
        validate(value) {
            if (value.includes("password")) {
                throw new Error("password must not contain password word");
            }
        }
    },
    
    tokens: [{
        token: {
            type: String,
            required:true
        }
    }],
    task: [{
       
            type: mongoose.Schema.Types.ObjectId,
            ref:"Task"
        
    }],
    photo: {
        type:Buffer
    }
    
},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps:true
});
userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField:"owner"
    
})

userSchema.methods.genrateToken = async function () {

    const token = jwt.sign({ _id: this._id.toString() }, "ragheb111");
    this.tokens = this.tokens.concat({ token })
    this.save();

     return token
}
userSchema.methods.toJSON = function () {
    const userobj = this.toObject();
    delete userobj.password;
    delete userobj.tokens;
    delete userobj.photo;

    

    return userobj;
}
userSchema.statics.findByInfo = async function (email, password) {
    
    const user = await User.findOne({ email }).populate("tasks")
    if (!user) {
        return false;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
        return user;
    }


        return false
    }


    
// userSchema.pre("deleteMany", async function (req, res, next) {
//     const task = await Task.deleteMany({ owner: req.user._id })
//     console.log(task);
    
//     next();
// });
    

userSchema.pre("save", async function (next) {
    const user=this
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

const User = mongoose.model("User", userSchema);

module.exports = User;