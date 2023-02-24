const router = require("express").Router();
const {
  addComment,
  removeComment,
  addReply,
  removeReply,
} = require("../../controllers/comment-controller");

// /api/comments/<pizzaId>
router.route("/:pizzaId").post(addComment);

// /api/comments/<pizzaId>/<commentId>
router
  .route("/:pizzaId/:commentId")
  //use PUT vs POST b/c technically we're not creating a new reply resource;
  // we're just updating the existing comment resource
  .put(addReply)
  .delete(removeComment);

  //modeling routes in a RESTful manner: as a best practice, include the ids of the
  //parent resources in the endpoint. Suggests "Go to this pizza, then look at this
  // particular comment, then delete this one reply."
router.route("/:pizzaId/:commentId/:replyId").delete(removeReply);

module.exports = router;
