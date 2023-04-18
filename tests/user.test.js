
const request = require('supertest');
const app = require("./../src/app");
const User=require("./../src/models/user")
const {userId,user,setDB}=require("./fixtures/db")

beforeEach(setDB)


test("sign up", async () => {
    const res = await request(app).post("/users/sign-up").send({
        
         name: "ragheb gamal",
            email: "raghebgamal000@gmail.com",
            age: 28,
            password:"ragheb111"
    })
    expect(res.statusCode).toBe(201);
    const usersign = await User.findById(res.body.user._id);
    

    expect(usersign).not.toBeNull();
    expect(res.body.user).toMatchObject({name: "ragheb gamal",
            email: "raghebgamal000@gmail.com"

    }
        )
      
});
  
test("log in", async () => {
    const res = await request(app).post("/users/login").send({
        
            email: user.email,
            password:user.password
    })
    expect(res.status).toBe(200)
    const userlogin = await User.findById(res.body.user._id);
    expect(res.body.token).toBe(userlogin.tokens[1].token)

     
      
});
test("incorrect login", async () => {
    const res = await request(app).post("/users/login").send({
        
            email: user.email,
            password:"anything"
    })
    expect(res.status).toBe(404)
     
      
});
test("get me", async () => {
    const res = await request(app)
        .get("/users/get-me")
        .set("Authorization", `Bearer ${user.tokens[0].token}`)
        .send()
    expect(res.status).toBe(201)
     
      
});



test("delete me", async () => {
    const res = await request(app)
        .delete("/users/delete-me")
        .set("Authorization", `Bearer ${user.tokens[0].token}`)
        .send()
    expect(res.status).toBe(201)
    const userdeleted = await User.findById(userId);
    expect(userdeleted).toBeNull();

     
      
});
test("update me", async () => {
    const res = await request(app)
        .patch("/users/update-me")
        .set("Authorization", `Bearer ${user.tokens[0].token}`)
        .send({
            name: "ragheb gamal",
            email: "raghebgamal000@gmail.com",
            age: 28,
            password:"ragheb111"
        })
    expect(res.status).toBe(201)
    const userupdate = await User.findById(userId);
    expect(userupdate.name).toEqual("ragheb gamal")

      
});
test(" invalid update me", async () => {
    const res = await request(app)
        .patch("/users/update-me")
        .set("Authorization", `Bearer ${user.tokens[0].token}`)
        .send({
            anythig:""
        })
    expect(res.status).toBe(404)
   

      
});
test("log out", async () => {
    const res = await request(app)
        .get("/users/log-out")
        .set("Authorization", `Bearer ${user.tokens[0].token}`)
        .send({
            name: "ragheb gamal",
            email: "raghebgamal000@gmail.com",
            age: 28,
            password:"ragheb111"
        })
    expect(res.status).toBe(200)
     
      
});

test("upload photo ", async () => {
    const res = await request(app)
        .post("/users/me/photo")
        .set("Authorization", `Bearer ${user.tokens[0].token}`).
         attach("upload","tests/fixtures/ragheb.jpg")  
            const userupload = await User.findById(userId);

    expect(res.status).toBe(200)
    expect(userupload.photo).toEqual(expect.any(Buffer))
     
      
});