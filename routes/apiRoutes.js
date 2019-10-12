var db = require("../models");
var dotenv = require("dotenv");
dotenv.config();

module.exports = function(app) {
  // Get User Data
  app.get("/api/user", function(req, res) {
    db.User.findAll({ where: { auth_id: req.user.id } }).then(function(dbExamples) {
      res.json(dbExamples[0]);
      console.log("log");
    });
  });

  app.get("/api/matches", function(req, res) {
    console.log("Getting matches");
    db.Matches.findAll({
      where: {
        profileID1: req.query.auth_id,
        profileID2: req.user.id
      }
    }).then(function(reply) {
      console.log("Found :", reply);
      res.json(reply);
    }).catch(function(err) {
      console.log(err);
    });
  });

  app.put("/api/matches", function(req, res) {
    let matchId = req.body.id;
    console.log("PUTTING");
    db.Matches.update({
      Success: true
    }, {
      where: {
        id: matchId
      }
    }).then(function(reply) {
      res.json(reply);
    });
  });

  app.post("/api/matches", function(req, res) {
    let userID = req.user.id;
    let matchID = req.body.auth_id;
    db.Matches.create({
      profileID1: userID,
      profileID2: matchID,
      matching: true
    }).then(function(reply) {
      res.json(reply);
    });
  });

  // app.get("/api/chat", function(req, res) {

  // });

  app.post("/chat", function(req, res) {
    console.log("Hello?", req.user.id, req.body.user, req.body.message);
    db.Chats.create({
      matchID: 666,
      auth_id: req.user.id,
      user: req.body.user,
      message: req.body.message
      // include: [db.matches]
    }).then(function(dbUser) {
      res.json(dbUser);
    }).catch(function(err) {
      console.log(err);
    });
  });

  // Update user in DB
  app.put("/userAccount", function(req, res) {
    db.User.update({
      username: req.body.username,
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      birthdate: req.body.birthdate,
      email: req.body.email,
      bio: req.body.bio,
      zipcode: parseInt(req.body.zipcode),
      searchRadius: parseInt(req.body.searchRadius)
    }, {
      where: {
        auth_id: req.user.id
      }
    }).then(function(result) {
      res.json(result);
    }).catch(function(err) {
      console.log("Errr", err);
    });
  });

  app.get("/api/search/users/", function(req, res) {
    console.log("FUCK YOU");
    let zipArray = req.query.ziplist;
    console.log(zipArray);
    db.User.findAll({
      where: {
        zipcode: zipArray
      }
    }).then(function(allUsers) {
      console.log("THIS IS THE RESULT", allUsers);
      res.json(allUsers);
    }).catch(function(err) {
      console.log(err);
    });
  });
  app.get("/api/matches/success", function(req, res) {
    console.log("Getting matches");
    db.Matches.findAll({
      where: {
        Success: true,
        profileID1: req.user.id
      }
    }).then(function(reply) {
      console.log("pt2");
      db.Matches.findAll({
        where: {
          Success: true,
          profileID2: req.user.id
        }
      }).then(function(reply) {
        console.log("Found :", reply);
        res.json(reply);
      }).catch(function(err) {
        console.log(err);
      });
    });
  });
};
