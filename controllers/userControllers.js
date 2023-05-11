const { User, Thought } = require('../models');

module.exports = {

  // To get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // To get single user by user id
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('thoughts');

      if (!user) {
        return res.status(404).json({ message: 'No user found with that ID!' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const dbUserData = await User.create(req.body);
      res.json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // updating user by user id
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user found with that ID!' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // To delete a user by user id
  async deleteUser(req, res) {

    try {
      const user = await User.findOneAndDelete(
        { _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No user found with that ID!' });
      }
      res.json({ message: "User deleted!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Adding new friend
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then(
        (user) =>
          !user ? res.status(404).json({ message: 'No user found with that ID!' }) : res.json(user)
      )
      .catch(
        (err) => res.status(500).json(err)
      );
  },

  // We want to remove friend from user but not totally delete a friend - we using delete but not mean totally deleting it's info, just removing friend from his data (friend list)
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then(
        (user) =>
          !user ? res.status(404).json({ message: 'No user found with that ID!' }) : res.json(user)
      )
      .catch(
        (err) => res.status(500).json(err)
      );
  },
};