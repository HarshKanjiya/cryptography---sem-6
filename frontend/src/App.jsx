import { useEffect, useState } from "react";
import "./App.css";
import PlayFair from "./components/PlayFair";

const init = {
  user: "",
  message: "",
};

function App() {
  const [data, setData] = useState(init);
  const [increptedMsg, setincreptedMsg] = useState("");
  const [messages, setMessages] = useState([]);

  // mono lab 2
  const [inputText, setinputText] = useState("");
  const [monoCResText, setMonoCResText] = useState("");

  useEffect(() => {
    getMsg();
  }, []);

  const sendMsg = async () => {
    await fetch("http://localhost:2020/server/sendmsg", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        user: data.user,
        message: data.message,
        secret_key: 5,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success === true) {
          getMsg();
          setincreptedMsg(res.increptedMsg);
        }
      });
  };
  const getMsg = async () => {
    await fetch("http://localhost:2020/server/getmsg", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success === true) {
          let temp = [];
          res.resMsges.map((msg) => {
            temp = [msg, ...temp];
          });
          setMessages(temp);
        }
      });
  };

  const HelperSendMonoAlphabeticFile = (event) => {
    let reader = new FileReader();
    reader.onload = async function (e) {
      setinputText(e.target.result);
      await fetch("http://localhost:2020/server/monoalphabetic/sendtext", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          text: e.target.result,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success === true) {
            setMonoCResText(res.textRes);
          }
        });
    };
    reader.readAsText(event.target.files[0]);
  };

  return (
    <div className="App">
      <div className="wrapper">
        <div className="header">Ceaser cipher</div>
        <div className="footer">
          <input
            placeholder="user name"
            style={{ maxWidth: 100 }}
            onChange={(event) => {
              setData({ ...data, user: event.target.value });
            }}
          />
          <input
            placeholder="message"
            onChange={(event) => {
              setData({ ...data, message: event.target.value });
            }}
          />
          <button onClick={sendMsg}>send</button>
        </div>
        <div>
          {messages.map((msg, index) => {
            return (
              <div className="chatMsg" key={index}>
                <p className="chatMsg-name">{msg.user}</p>
                <p className="chatMsg-msg">{msg.message}</p>
              </div>
            );
          })}
          <p>
            {increptedMsg !== "" ? ` msg sent was : ${increptedMsg} ` : null}
          </p>
        </div>
      </div>
      <div className="wrapper">
        <div className="header">Mono Alphabetic</div>
        <div className="footer">
          <input type="file" onChange={HelperSendMonoAlphabeticFile} />
        </div>
        <p>sent Text: {inputText} </p>
        <p>increpted Text: {monoCResText}</p>
      </div>

      <PlayFair />
    </div>
  );
}

export default App;
