const { Thought, User } = require('../models');

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    }
     catch (err) {
      res.status(500).json(err);
    }
  },

  // Getting one thought by its id
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought found with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err)
    }
  },
  // create a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: 'Thought created, but found no user with that ID' });
      }

      res.json('Thought created 🎉');
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

// update an existing thought
async updateThought(req, res) {
try {
const thought = await Thought.findOneAndUpdate(
{ _id: req.params.thoughtId },
{ $set: req.body },
{ runValidators: true, new: true}
);

if (!thought) {
  return res.status(404).json({ message: 'No thought found with that ID' });
}

res.json(thought);
} catch (err) {
  res.status(500).json(err);
}
},

// delete thought
deleteThought (req,res) {

Thought.findOneAndDelete(
  {_id: req.params.thoughtId}
) .then (
(thought) =>
!thought ? res.status(404).json ({ message: 'No thought found with that ID' }) : User.findOneAndUpdate(
  {thoughts: req.params.thoughtId},
  {$pull: {thoughts: req.params.thoughtId}},
  {new: true}
)
) .then (
  (user) =>
  !user ? res.status(404).json({ message: 'Thought deleted, but no user found' }) : res.json({message: "Thought successfully deleted"})
) .catch (
  (err) => res.status(500).json(err)
);
},

async createReaction (req, res) {
  try {
    const thought = await Thought.findOneAndUpdate(
      {_id: req.params.thoughtId},
      {$addToSet: {reactions: req.body}},
      { runValidators: true, new: true}
    );

    if (!thought) {
      return res.status(404).json({ message: 'No thought found with that ID' });
    }
    res.json(thought);
  }
  catch (err) {
    res.status(500).json(err);
  }
},

// removing the reaction

async removeReaction (req, res) {

  try {
    const thought = await Thought.findOneAndUpdate(
      {_id: req.params.thoughtId},
      {$pull: {reactions: {reactionId: req.params.reactionId}}},
      { runValidators: true, new: true} 
    )
    if (!thought) {
      return res.status(404).json({ message: 'No thought found with that ID' });
    }
    res.json(thought);
  }
  catch (err) {
    res.status(500).json(err);
  }    
  },
};