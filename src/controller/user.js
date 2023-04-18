const User = require("./../models/user");
const account=require("./../emails/account")

exports.logOut = async (req, res) => {
     try {

         req.user.tokens = req.user.tokens.filter((obj) => {
             return obj.token !== req.token
         });
         await req.user.save();
                 res.status(200).json({ user:req.user })

         


    } catch (err) {
        res.status(500).json({ err })
    }
}
exports.logOutAll = async (req, res) => {
     try {

         req.user.tokens = []
         await req.user.save();
         res.status(200).json({ user:req.user })

         


    } catch (err) {
        res.status(500).json({ err })
    }
}
exports.logIn = async (req, res) => {
    try {
        const user = await User.findByInfo(req.body.email, req.body.password);


        if (!user) {
            return res.status(404).json({ message: "password not correct or user not found" })
        }
                    const token = await user.genrateToken();

            res.status(200).json({ user,token })


    } catch (err) {
        res.status(500).json({ err })
    }
}

exports. getUser = async (req, res) => {
    try {
        const user = await User.find().populate("tasks");

        res.status(201).json({ user })
    } catch (err) {
        res.status(500).json({ err })

    }
};
exports.getMe = async (req, res) => {
    try {
        const user = await req.user.populate("task")
        
        res.status(201).json({ user})
    } catch (err) {
        console.log(err)
        res.status(500).json({ err })

    }
};
exports.updateMe = async (req, res) => {
     try {
        const update = ["name", "age", "email", "password"]
        const isvalid = Object.keys(req.body).every((el) => update.includes(el));
        if (isvalid) {
           // const user = await User.findByIdAndUpdate(req.params.id,req.body, { new: true, runValidators: true });
            const user =req.user
           
            if (!user) {
                return res.status(404).json({ message: "user not found" })
            }
            Object.keys(req.body).forEach((el) => {
                user[el] = req.body[el]
                
            });
            await user.save();
            res.status(201).json({ user })
        } else {
            return res.status(404).json({ message: "input update not valid" })
            
        }
    } catch (err) {

        res.status(500).json({ err })
 
    }

}

exports.deleteMe = async (req, res) => {
     try {

        const user = await User.findByIdAndDelete(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "user not found" })
         }
         account.sendEmailCancel(user.email,user.name)

        res.status(201).json({ user })
    
            
        
    } catch (err) {

        res.status(500).json({ err })
 
    }
};

exports. postUser = async (req, res,next) => {
    try {
        const user = await User.create(req.body);

            account.sendEmail(user.email,user.name)

        const token = await user.genrateToken();
        
          

        res.status(201).json({ user,token})
    } catch (err) {
        res.status(500).json({ err });

    }
};
exports. getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        res.status(201).json({ user })
    } catch (err) {

        res.status(500).json({ err })
 
    }

};
exports. updateUserById=async (req, res) => {
    
    
    try {
        const update = ["name", "age", "email", "password"]
        const isvalid = Object.keys(req.body).every((el) => update.includes(el));
        if (isvalid) {
           // const user = await User.findByIdAndUpdate(req.params.id,req.body, { new: true, runValidators: true });
            const user = await User.findById(req.params.id);
           

            if (!user) {
                return res.status(404).json({ message: "user not found" })
            }
            Object.keys(req.body).forEach((el) => {
                user[el] = req.body[el]
                
            });
            await user.save();
            res.status(201).json({ user })
        } else {
            return res.status(404).json({ message: "input update not valid" })
            
        }
    } catch (err) {

        res.status(500).json({ err })
 
    }

}

exports. deleteUserById = async (req, res) => {
    
    
    try {

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        res.status(201).json({ user })
    
            
        
    } catch (err) {

        res.status(500).json({ err })
 
    }

};
