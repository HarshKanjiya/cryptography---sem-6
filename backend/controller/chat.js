let messages = [];

exports.sendMsg = async (req, res, next) => {
  // console.log('req.message :>> ', req.body.message);
  const { user, message, secret_key } = req.body;

  if (!user || !message) {
    return res.status(400).json({
      success: false,
      message: "please, fill all the details",
    });
  }

  const msgArr = message.split("");
  let msgINC = [];
  msgArr.map((char) => {
    let temp = "";

    if (char === " ") {
      temp = " ";
    } else if (char === char.toUpperCase()) {
      temp = ((char.charCodeAt(0) + secret_key - 65) % 26) + 65;
      temp = String.fromCharCode(temp);
    } else if (char === char.toLowerCase()) {
      temp = ((char.charCodeAt(0) + secret_key - 97) % 26) + 97;
      temp = String.fromCharCode(temp);
    }
    msgINC.push(temp);
  });

  let resMSG = msgINC.join("");
  messages.push({ user: user, message: resMSG });

  res.status(200).json({
    success: true,
    increptedMsg: resMSG,
    messages,
  });
};

exports.getMsg = async (req, res, next) => {
  let resMsges = [];
  let resStrArr = [];
  // let dummyMsg = [];
  console.log("messages :>> ", messages);

  messages.map((baseData, index) => {
    let baseIncMessage = baseData.message;
    let mainIndex = index;
    resStrArr = [];

    baseData.message.split("").map((char) => {
      if (char === " ") {
        temp = " ";
      } else if (char === char.toUpperCase()) {
        temp =
          ((char.charCodeAt(0) - process.env.SECRET_NUM - 65 + 26) % 26) + 65;
        temp = String.fromCharCode(temp);
      } else if (char === char.toLowerCase()) {
        temp =
          ((char.charCodeAt(0) - process.env.SECRET_NUM - 97 + 26) % 26) + 97;
        temp = String.fromCharCode(temp);
      }
      resStrArr.push(temp);
    });
    let resMsg = resStrArr.join("");
    resMsges.push({ user: baseData.user, message: resMsg });
    baseData.message = baseIncMessage;
  });

  // messages.map((msg) => {
  //   resMsges.push(msg);
  //   dummyMsg.push(msg);
  // });

  // dummyMsg.map((dummyData, index) => {
  //   let resMsg = "";
  //   let resStrArr = [];
  //   let temp;
  //   let mainIndex = index;
  //   let increptedMsg = dummyData.message

  //   console.log('increptedMsg :>> ', increptedMsg);

  // decrypter
  //     let IncMsgArr = dummyData.message.split("");
  //     IncMsgArr.map((char) => {
  //       if (char === " ") {
  //         temp = " ";
  //       } else if (char === char.toUpperCase()) {
  //         temp =
  //           ((char.charCodeAt(0) - process.env.SECRET_NUM - 65 + 26) % 26) + 65;
  //         temp = String.fromCharCode(temp);
  //       } else if (char === char.toLowerCase()) {
  //         temp =
  //           ((char.charCodeAt(0) - process.env.SECRET_NUM - 97 + 26) % 26) + 97;
  //         temp = String.fromCharCode(temp);
  //       }
  //       resStrArr.push(temp);
  //     });
  //     resMsg = resStrArr.join("");

  // resMsges.map((data, index) => {
  //   if (index === mainIndex) {
  //     data.message = resMsg;
  //   }
  // });

  //     dummyData.message = increptedMsg
  // });

  res.status(200).json({
    success: true,
    resMsges,
  });
};
