//importing Schema constructor and model function
const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

//Note: Mongoose only executes the validators in the schema automatically when creating new data
   //reference "runValidators: true" on controllers for PUT (update data)

const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
      //indicates a required field that must be filled in/cannot be left blank
      required: true,
      //removes white space before and after the input string
      trim: true,
    },
    createdBy: {
      type: String,
      //adding text after "required:" allows you to provide a custom error message
      required: 'You need to provide a name for Created by!',
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      //use mongoose "getters" to transform date into specified format when displayed
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    size: {
      type: String,
      required: true,
      //validate by providing an array of options that this size field will accept
      //note: the enum option stands for enumerable
      enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
      default: 'Large'
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
  return this.comments.reduce(
    (total, comment) => total + comment.replies.length + 1,
    0
  );
});

// create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

// export the Pizza model
module.exports = Pizza;
