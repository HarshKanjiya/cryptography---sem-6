const express = require("express");
const cors = require("cors");

const { sendMsg, getMsg } = require("./controller/chat");

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
app.use(router);

module.exports = app;
