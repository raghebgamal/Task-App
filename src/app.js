const express = require("express");
const app = express();

const userRoute = require("./routers/user");
const taskRoute = require("./routers/task");
 

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({name:"ragheb"})
})
app.use("/users", userRoute)
app.use("/tasks", taskRoute);



module.exports = app;
