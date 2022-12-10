const express = require("express");
const { GameModel, validateGame } = require("../models/gamesModel");
const { auth } = require("../middleWares/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  let perPage = Number(req.query.perPage) || 10; //10 users per page will appear
  let page = Number(req.query.page) || 1; //Number of pages
  let sort = req.query.sort || "_id"; //It gets the route of a specific tage (ex: game/company)
  let reverse = req.query.reverse == "yes" ? 1 : -1;

  try {
    let data = await GameModel.find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/userList", auth, async (req, res) => {
  let perPage = Number(req.query.perPage) || 4;
  let page = Number(req.query.page) || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;

  try {
    let data = await GameModel.find({ user_id: req.tokenData._id })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/price", async (req, res) => {
  try {
    let min = req.query.min || 1;
    let max = req.query.max || 200;
    let data = await GamesModel.find({ price: { $lte: max, $gte: min } }).limit(
      20
    );
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/search", async (req, res) => {
  try {
    let searchQ = req.query.s;
    let searchExp = new RegExp(searchQ, "i");

    let data = await GameModel.find({ name: searchExp }).limit(20);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/category", async (req, res) => {
  try {
    let searchQ = req.query.s;
    let categoryExp = new RegExp(searchQ, "i");
    let data = await GameModel.find({ category: categoryExp }).limit(20);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/", auth, async (req, res) => {
  let validBody = validateGame(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }

  try {
    let game = new GameModel(req.body);
    game.user_id = req.tokenData._id;
    await game.save();
    res.status(201).json(game);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/:idEdit", auth, async (req, res) => {
  let validBody = validateGame(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }

  try {
    let idEdit = req.params.idEdit;
    let data = await GameModel.updateOne(
      { _id: idEdit, user_id: req.tokenData_id },
      req.body
    );
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/:idDel", auth, async (req, res) => {
  try {
    let idDel = req.params.idDel;
    let data = await GameModel.deleteOne({
      id: idDel,
      user_id: req.tokenData._id,
    });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
