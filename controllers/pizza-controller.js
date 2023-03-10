const { Pizza } = require("../models");

const pizzaController = {
  // the functions below go in here as methods

  // get all pizzas  (GET /api/pizzas)
  getAllPizza(req, res) {
    Pizza.find({})
      //.populate() enables display of the comment (vs just the comment's id)
      .populate({
        path: "comments",
        //the - tells mongoose that we don't care about the __v field on comments
        //without this, it would it would *only* return the __v field
        select: "-__v",
      })
      //tells the query to not include the pizza's __v field either
      .select("-__v")
      //sorts pizza's in descending order to show newest first
      .sort({ _id: -1 })
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one pizza by id   (GET /api/pizzas/:id)
  getPizzaById({ params }, res) {
    Pizza.findOne({ _id: params.id })
      .populate({
        path: "comments",
        select: "-__v",
      })
      .select("-__v")
      .then((dbPizzaData) => {
        // If no pizza is found, send 404
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  // createPizza   (POST /api/pizzas)
  createPizza({ body }, res) {
    Pizza.create(body)
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => res.status(400).json(err));
  },
  // update pizza by id   (PUT /api/pizzas/:id)
  updatePizza({ params, body }, res) {
    //setting the parameter to true instructs Mongoose to return the new version of the document
    //note: There's also .updateOne() and .updateMany(), which update documents without returning them
    //"runValidators:true" should be included on any PUT to ensure validation is ran on updates
    Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },
  // delete pizza (DELETE /api/pizzas/:id)
  deletePizza({ params }, res) {
    //could have used .deleteOne() or .deleteMany(), but using .findOneAndDelete() method
    //because it provides a little more data in case the client wants it.
    Pizza.findOneAndDelete({ _id: params.id })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = pizzaController;
