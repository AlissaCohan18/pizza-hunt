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
      getters: true
    },
    //set to false bc it's a virtual that Mongoose returns & we don’t need it
    id: false,
  }
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

// create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

// export the Pizza model
module.exports = Pizza;
