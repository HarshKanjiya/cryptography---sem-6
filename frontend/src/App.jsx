import { useEffect, useState } from "react";
import "./App.css";

const init = {
  user: "",
  message: "",
};

function App() {
  const [data, setData] = useState(init);
  const [increptedMsg, setincreptedMsg] = useState("");
  const [messages, setMessages] = useState([]);

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
          setMessages(res.resMsges);
        }
      });
  };

  return (
    <div className="App">
      <div className="wrapper">
        <div className="header">Chat App</div>
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
    </div>
  );
}

export default App;
