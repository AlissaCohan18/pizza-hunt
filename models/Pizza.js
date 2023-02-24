//importing Schema constructor and model function
const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
    },
    createdBy: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      //use mongoose "getters" to transform date into specified format when displayed
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    size: {
      type: String,
      default: "Large",
    },
    toppings: [],
    comments: [
      {
        type: Schema.Types.ObjectId,
        //The ref property tells the Pizza model which documents to search
        //to find the right comments.
        ref: "Comment",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      //tells mongoose model to use any getter function specified
      getters: true,
    },
    //set to false bc it's a virtual that Mongoose returns & we don’t need it
    id: false,
  }
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual("commentCount").get(function () {
  //using the .reduce() method to tally up the total of every comment with its replies
  //it takes 2 parameters (accumulator/total & currentValue/comment) & then walks thru the array,
  //passing the accumulating total and the current value of comment into the function, with
  // the return of the function revising the total for the next iteration through the array
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

// export the Pizza model
module.exports = Pizza;
