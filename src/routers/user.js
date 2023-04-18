const express = require("express");
const router = new express.Router();
const controller=require("./../controller/user")
const authentication = require("./../middleware/auth")
const sharp = require("sharp");
const multer = require("multer");
const User = require("../models/user");
const upload = multer({
    limits: {
        fileSize: 10000000,
    },

    fileFilter (req, file, cb) {

        if (file.originalname.match(/\.(jpg|jpeg|png|doc|docx|pdf|xlsx)$/)) {
           return cb(null, true)
        }
        cb(new Error('I don t have a permision to accept this file!'))

}
    
});
const errorCatch = (err, req, res, next) => {
    res.status(400).json({message:err.message})
}
router.route("/me/photo").post(authentication.Protect, upload.single("upload"), async (req, res) => {
const buffer=await sharp(req.file.buffer).resize({width:200,height:200}).jpeg().toBuffer()
    req.user.photo = buffer;
    await req.user.save();
    res.json({ message: "uploaded", user: req.user.photo })
}, errorCatch);
router.route("/me/photo").delete(authentication.Protect, async(req, res) => {
    req.user.photo = undefined;
  await  req.user.save();
    res.json({message:"deleted",user:req.user.photo})
})
router.route("/:id/photo").get(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.photo) {
            return res.json({ message: "error" })
        }
        res.set("Content-Type", "image/jpeg");
        res.json({ myphoto: user.photo})

    } catch (err) {
        res.json({ error: err})
    }
})

router.route("/login").post(controller.logIn);
router.route("/get-me").get(authentication.Protect, controller.getMe);
router.route("/update-me").patch(authentication.Protect,controller.updateMe);
router.route("/delete-me").delete(authentication.Protect,authentication.deleteOther,controller.deleteMe);

router.route("/sign-up").post(controller.postUser);
router.route("/log-out").get(authentication.Protect,controller.logOut);
router.route("/log-out-all").get(authentication.Protect,controller.logOutAll);

router.route("/").get(authentication.Protect, controller.getUser)
    .post(controller.postUser);
router.route("/:id")
    .get(controller.getUserById)
    .patch(controller.updateUserById)
    .delete(controller.deleteUserById);
module.exports = router;