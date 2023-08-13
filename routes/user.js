const router = require('express').Router();
const User = require('../models/User');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

// update an user 
router.put('/:id', verifyTokenAndAuthorization,async (req, res) => {
  if(req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC_KEY).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    return res.status(200).json(updatedUser);
  } 
  catch(err) {
    res.status(500).json(err); 
  }
});

// delete an user
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("user has been deleted..")
  }
  catch(err) {
    res.status(500).json(err)
  }
});

// get user -admin 
router.get('/find:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const {password, ...others} = user._doc;
    res.status(200).json(others);
  }
  catch(err) {
    res.status(500).json(err)
  }
});
// get all user 
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query 
      ? await User.find().sort(-1).limit(1) 
      : await User.find();
    res.status(200).json(users);
  }
  catch(err) {
    res.status(500).json(err)
  }
});

// GET USER STATS
router.get('/stats', async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      { $project: { mont: { $month: "$createdAt" } } },
      { $group: { _id: "$month", total: { $sum: 1 } } }
    ]);
    res.status(200).json(data);
  }
  catch(err) {

  }
});

// export routes
module.exports = router;