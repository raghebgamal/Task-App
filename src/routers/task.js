const express = require("express");
const router =new express.Router();
const controller=require("./../controller/task")
const authentication=require("./../middleware/auth")



router.route("/")
    .get(authentication.Protect, controller.getTasks)
    .post(authentication.Protect, controller.postTask);
    
router.route("/:id").
    get(authentication.Protect, controller.getTaskById)
    .patch(authentication.Protect, controller.updateTaskById)
    .delete(authentication.Protect, controller.deleteTask)



module.exports = router;