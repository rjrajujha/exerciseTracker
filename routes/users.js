const express = require('express');
const User = require('../models/users');
const Exercise = require('../models/exercise');
const bodyParser = require('body-parser');
const app = express.Router();

// create application/json parser
// var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/", async (req, res) => {
  const { username } = req.body;
  let user = await User.findOne({ username: req.body.username });
  if (!user) {
    user = new User({ username: username });
    await user.save();

    res.status(200).json(user);
  } else {
    res.status(400).send("This user already exists.");
  }
});

app.get("/", (req, res) => {
  User.find()
    .then((result) => res.status(200).json(result))
    .catch((error) => res.status(400).send(error));
});

const getDate = (date) => {
  if (!date) {
    return new Date().toDateString();
  }
  const correctDate = new Date();
  const dateString = date.split("-");
  correctDate.setFullYear(dateString[0]);
  correctDate.setDate(dateString[2]);
  correctDate.setMonth(dateString[1] - 1);

  return correctDate.toDateString();
};

app.post("/:_id/exercises", async (req, res) => {
  const { description, duration, date } = req.body;

  let exercise = new Exercise({
    description: description,
    duration: duration,
    date: getDate(date),
  });

  await exercise.save();

  User.findByIdAndUpdate(
    req.params._id,
    { $push: { log: exercise } },
    { new: true }
  ).then((result) => {
    let resObj = {};
    resObj["_id"] = result._id;
    resObj["username"] = result.username;
    resObj["date"] = exercise.date;
    resObj["duration"] = exercise.duration;
    resObj["description"] = exercise.description;

    res.json(resObj);
  })
    .catch(error => res.status(400).send(error));
});

app.get("/:_id/logs", (req, res) => {
  User.findById(req.params._id).then((result) => {
    let resObj = result;

    if (req.query.from || req.query.to) {
      let fromDate = new Date(0);
      let toDate = new Date();

      if (req.query.from) {
        fromDate = new Date(req.query.from);
      }

      if (req.query.to) {
        toDate = new Date(req.query.to);
      }

      fromDate = fromDate.getTime();
      toDate = toDate.getTime();

      resObj.log = resObj.log.filter((session) => {
        let sessionDate = new Date(session.date).getTime();
        return sessionDate >= fromDate && sessionDate <= toDate;
      });
    }
    if (req.query.limit) {
      resObj.log = resObj.log.slice(0, req.query.limit);
    }
    resObj["count"] = result.log.length;
    res.json(resObj);
  });
});


module.exports = app;