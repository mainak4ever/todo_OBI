const dotenv = require("dotenv");
const { app } = require("./app");
const connectDB = require("./db");
dotenv.config({
  path: `./.env`,
});

connectDB()
  .then(() => {
    console.log("test", process.env.PORT);
    app.listen(process.env.PORT || 8001, () => {
      console.log("Server is running on port", process.env.PORT || 8001);
    });
  })
  .catch((error) => {
    console.log("Error connecting to the database", error);
  });
