const express = require("express");
const cors = require("cors");

const { sendMsg, getMsg, monoAlphabetic, playfair } = require("./controller/chat");

const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true,
  })
);
const router = express.Router();

router.route("/server/sendmsg").post(sendMsg);
router.route("/server/getmsg").get(getMsg);
router.route('/server/monoalphabetic/sendtext').post(monoAlphabetic)
router.route('/server/playfair').post(playfair)

app.use(router);


module.exports = app;
