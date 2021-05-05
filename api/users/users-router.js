const express = require("express");
const { post } = require("../server");
const User = require("./users-model");
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();
function logger(req, res, next) {
  console.log(`
  ${req.method} request to ${req.baseUrl} endpoint!`);
  next();
}

async function idChecker(req, res, next) {
  try {
    const user = await User.getById(req.params.id);
    if (!user) {
      next({
        status: 404,
        message: `user with id ${req.params.id} not found!`,
      });
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    next(err);
  }
}
async function validateUser(req, res, next) {
  try {
    const userBody = req.body;
    if (!userBody.name || !userBody) {
      res.status(400).json({
        message: "missing required name and field",
      });
    } else {
      res.user = userBody;
      next();
    }
  } catch (err) {
    next(err);
  }
}
async function validatePost(req, res, next) {
  try {
    const postBody = req.body;
    if (!postBody.text) {
      res.status(400).json({
        messsage: "fill in the info",
      });
    } else {
      req.post = postBody;
      next();
    }
  } catch (err) {
    next(err);
  }
}

router.get("/", logger, (req, res, next) => {
  User.get().then((users) => {
    res
      .status(200)
      .json({
        users: users,
      })
      .catch(next);
  });
  // RETURN AN ARRAY WITH ALL THE USERS
});

router.get("/:id", logger, idChecker, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
});

router.post("/", validateUser, (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
});

router.put("/:id", logger, idChecker, validateUser, (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.delete("/:id", logger, idChecker, (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
});

router.get("/:id/posts", logger, idChecker, (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
});

router.post("/:id/posts", logger, idChecker, validatePost, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

// do not forget to export the router
