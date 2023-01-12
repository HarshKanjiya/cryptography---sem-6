import React, { useState } from "react";

const PlayFair = () => {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [res, setRes] = useState("");

  const SubmitHandler = async () => {
    try {
      await fetch("http://localhost:2020/server/playfair", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          plainText: text,
          key: key,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          setRes(res.msg);
          console.log("res :>> ", res);
        });
    } catch (err) {
      console.log("err :>> ", err.message);
      // alert(err);
    }
  };

  return (
    <div className="wrapper">
      <div className="header">Play Fair</div>
      <div className="footer">
        <input
          placeholder="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <input
          style={{ width: "8rem" }}
          placeholder="key"
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
          }}
        />
      </div>
      <div className="flex-d-end">
        <button onClick={SubmitHandler}>send</button>
      </div>
      {res.trim() !== "" && <p>encrypted message : {res} </p>}
    </div>
  );
};

export default PlayFair;
