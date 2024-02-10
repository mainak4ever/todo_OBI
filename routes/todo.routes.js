const express = require("express");
const { todoController } = require("../controllers");
const { auth } = require("../middlewares/auth.middleware");

const router = express.Router();

router
  .route("/")
  .post(auth, todoController.addTodo)
  .get(auth, todoController.getTodosByUser);

router
  .route("/:todoId")
  .get(auth, todoController.getTodo)
  .patch(auth, todoController.updateTodo)
  .delete(auth, todoController.deleteTodo);

module.exports = router;
