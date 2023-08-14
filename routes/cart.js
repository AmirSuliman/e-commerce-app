const router = require('express').Router();
const Cart = require('../models/Cart');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

// create 
router.post('/', verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  }
  catch(err) {
    console.log(err.message);
    res.status(500).json(err);
  }
});

// update an user 
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    return res.status(200).json(updatedCart);
  } 
  catch(err) {
    res.status(500).json(err); 
  }
});

// delete Cart
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted..")
  }
  catch(err) {
    res.status(500).json(err)
  }
});

// get user Cart
router.get('/find:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ id: req.params.id });
    res.status(200).json(cart);
  }
  catch(err) {
    res.status(500).json(err)
  }
});

// // get all carts
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  const carts = await Cart.find();
  try {
    res.status(200).json(carts);
  }
  catch(err) {
    res.status(500).json(err);
  }
})

// export routes
module.exports = router;