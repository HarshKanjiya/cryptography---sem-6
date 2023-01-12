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

    // console.log("char :>> ", char);
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
  // console.log("messages :>> ", messages);

  messages.map((baseData, index) => {
    let baseIncMessage = baseData.message;
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
  res.status(200).json({
    success: true,
    resMsges,
  });
};

exports.monoAlphabetic = async (req, res, next) => {
  const { text } = req.body;

  let ABCD = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
  let ABCDArry = ABCD.split("");
  let ABCDArry2 = ABCD.split("");
  let textArry = text.split("");

  let len = 0;
  while (len <= 62) {
    let randomNum = Math.floor(Math.random(0, 62) * 63);

    if (len + randomNum < 63) {
      temp = ABCDArry2[len];
      ABCDArry2[len] = ABCDArry2[len + randomNum];
      ABCDArry2[len + randomNum] = temp;
    } else {
      temp = ABCDArry2[len];
      ABCDArry2[len] = ABCDArry2[len + randomNum - 63];
      ABCDArry2[len + randomNum - 63] = temp;
    }
    len = len + 1;
  }

  let textRes = [];
  textArry.map((i) => {
    let index = ABCDArry.indexOf(i);
    textRes.push(ABCDArry2[index]);
  });
  textRes = textRes.join("");

  res.status(200).json({
    success: true,
    textRes,
  });
};

exports.playfair = async (req, res, next) => {
  let { plainText, key } = req.body;
  if (plainText.trim() === "" || key.trim() === "") {
    res.status(400).json({
      message: "Enter both Values",
    });
    return;
  }
  // extra char for gouping // done
  let resString = "";
  let plainTextArray = [];
  if (plainText.trim().length % 2 !== 0) {
    plainText = plainText.trim() + "z";
  }
  for (let i = 0; i < plainText.length; i += 2) {
    let subArray = [plainText[i], plainText[i + 1]];
    plainTextArray.push(subArray);
  }

  // key triming // done
  key = key.trim().toLowerCase();
  let keyArray = key.split("");

  // finding matrix size // done
  let checker = false; // if this is true then its 6*6 else 5*5
  for (let index = 0; index < keyArray.length; index++) {
    if (parseInt(keyArray[index]) == keyArray[index]) {
      checker = true;
      break;
    }
  }
  if (checker) {
    // 6*6 code //done
    let matrixEle = "abcdefghijklmnopqrstuvwxyz0123465789";
    key = key + matrixEle;
    key = playFairRemoveDuplicateItems(key);

    // making of playfair matrix // done
    let PlayFairMatrix = [];
    for (let i = 0; i < key.length; i += 6) {
      let temp = [
        key[i],
        key[i + 1],
        key[i + 2],
        key[i + 3],
        key[i + 4],
        key[i + 5],
      ];
      PlayFairMatrix.push(temp);
    }

    // matching plain text in  matrix // done
    for (let i = 0; i < plainTextArray.length; i++) {
      // checking for each char in plain text
      let char1 = plainTextArray[i][0];
      let char2 = plainTextArray[i][1];
      let row1;
      let row2;
      let col1;
      let col2;

      // finding char location in table //done
      for (let j = 0; j < PlayFairMatrix.length; j++) {
        // checking for 6 cols
        for (let k = 0; k < PlayFairMatrix[j].length; k++) {
          // checking for 6 cells of row
          if (char1 === PlayFairMatrix[j][k]) {
            row1 = j;
            col1 = k;
          }
          if (char2 === PlayFairMatrix[j][k]) {
            row2 = j;
            col2 = k;
          }
        }
      }

      // geting cipher char from matrix //done
      if (col1 === col2) {
        row1 = (row1 + 1) % 6;
        row2 = (row2 + 1) % 6;
      } else if (row1 === row2) {
        col1 = (col1 + 1) % 6;
        col2 = (col2 + 1) % 6;
      } else {
        let temp = col1;
        col1 = col2;
        col2 = temp;
      }

      resString =
        resString + PlayFairMatrix[row1][col1] + PlayFairMatrix[row2][col2];
    }
  } else {
    // 5*5 code

    let matrixEle = "abcdefghiklmnopqrstuvwxyz";

    // converting all j to i in both and adding key to char string //done
    let temp = "";
    key.split("").map((char) => {
      if (char === "j") {
        temp += "i";
      } else {
        temp += char;
      }
    });
    key = temp;
    key = key + matrixEle;
    key = playFairRemoveDuplicateItems(key);
    temp = "";
    plainText.split("").map((char) => {
      if (char === "j") {
        temp += "i";
      } else {
        temp += char;
      }
    });
    plainText = temp;

    // grouping work
    plainTextArray = [];
    for (let i = 0; i < plainText.length; i += 2) {
      let subArray = [plainText[i], plainText[i + 1]];
      plainTextArray.push(subArray);
    }

    // making of playfair matrix // done
    let PlayFairMatrix = [];
    for (let i = 0; i < key.length; i += 5) {
      let temp = [key[i], key[i + 1], key[i + 2], key[i + 3], key[i + 4]];
      PlayFairMatrix.push(temp);
    }

    for (let i = 0; i < plainTextArray.length; i++) {
      // checking for each char in plain text
      let char1 = plainTextArray[i][0];
      let char2 = plainTextArray[i][1];
      let row1;
      let row2;
      let col1;
      let col2;

      // finding char location in table //done
      for (let j = 0; j < PlayFairMatrix.length; j++) {
        // checking for 6 cols
        for (let k = 0; k < PlayFairMatrix[j].length; k++) {
          // checking for 6 cells of row
          if (char1 === PlayFairMatrix[j][k]) {
            row1 = j;
            col1 = k;
          }
          if (char2 === PlayFairMatrix[j][k]) {
            row2 = j;
            col2 = k;
          }
        }
      }
// console.log('hi Harxh!!!');
// console.log('row1,col1,row2,col2 :>> ', row1,col1,row2,col2);
      // geting cipher char from matrix //done
      if (col1 === col2) {
        row1 = (row1 + 1) % 5;
        row2 = (row2 + 1) % 5;
      } else if (row1 === row2) {
        col1 = (col1 + 1) % 5;
        col2 = (col2 + 1) % 5;
      } else {
        let temp = col1;
        col1 = col2;
        col2 = temp;
      }

      resString =
        resString + PlayFairMatrix[row1][col1] + PlayFairMatrix[row2][col2];
    }
  }

  res.status(201).json({
    success: true,
    msg: resString,
  });
};

const playFairRemoveDuplicateItems = (string) => {
  return string
    .split("")
    .filter(function (item, pos, self) {
      return self.indexOf(item) == pos;
    })
    .join("");
};
