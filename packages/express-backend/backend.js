// backend.js
import express from "express";
import cors from "cors";
import userServices from "./services/user-services.js";

const app = express();
const port = 8000;
const users = {
    users_list: [
      {
        id: "xyz789",
        name: "Charlie",
        job: "Janitor"
      },
      {
        id: "abc123",
        name: "Mac",
        job: "Bouncer"
      },
      {
        id: "ppp222",
        name: "Mac",
        job: "Professor"
      },
      {
        id: "yat999",
        name: "Dee",
        job: "Aspring actress"
      },
      {
        id: "zap555",
        name: "Dennis",
        job: "Bartender"
      }
    ]
};

const deleteUser = (id) => {
    const index = users["users_list"].findIndex((user) => user["id"] === id);
    if (index != -1) {
        users["users_list"].splice(index, 1);
        return true;
    } else {
        return false
    }
}

app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    let promise;
    if (name != undefined && job == undefined) {
      promise = userServices.findUserByName(name);
    } else if (name == undefined && job != undefined) {
      promise = userServices.findUserByJob(job);
    } else if (name != undefined && job != undefined) {
      promise = userServices.findUserByNameAndJob(name,job);
    } else {
      promise = userServices.getUsers();
    }

    promise.then((result) => {res.json({ users_list: result });})
});

app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    let promise = userServices.findUserById(id);

    promise.then((user) => {
      if (user === undefined) {
        res.status(404).send("Resource not found.");
      } else {
        res.json({users_list: user});
      }
    })
});

app.delete("/users/:id", (req, res) => {
    const id = req.params["id"];
    let promise = userServices.deleteUser(id);
    promise.then(() => {
      res.send("success");
    }).catch((error) => console.log(error));
});

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    let promise
    promise = userServices.addUser(userToAdd);
    promise.then((newUser) => {res.status(201).json(newUser);})
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});