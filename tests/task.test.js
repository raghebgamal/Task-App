
const Task=require("./../src/models/task")
const request = require('supertest');
const app = require("./../src/app");
const { userId, user, setDB } = require("./fixtures/db");

describe(" should be task", () => {
    beforeEach(setDB);


    test(" post task", async () => {
        const res = await request(app)
            .post("/tasks")
            .set("Authorization", `Bearer ${user.tokens[0].token}`)
            .send({
                description: "create task"

            });
        expect(res.status).toBe(201);
        const task = await Task.findById(res.body.task._id);
    expect(task.completed).toEqual(false)

    
      
});
});