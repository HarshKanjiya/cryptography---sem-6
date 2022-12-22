const app = require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "./backend/config/config.env" });

const server = app.listen(2020, () => {
  console.log(`server is running on http://localhost: 2020`);
});

process.on("unhandledRejection", (err) => {
  console.log("Error : ", err.message);
  console.log("shutting down server due to unhandled promise rejection");

  server.close(() => {
    process.exit(1);
  });
});
