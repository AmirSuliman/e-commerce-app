const router = require('express').Router();
const Order = require('../models/Order');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

// create 
router.post('/', async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  }
  catch(err) {
    console.log(err.message);
    res.status(500).json(err);
  }
});

// update an Order  
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    return res.status(200).json(updatedOrder);
  } 
  catch(err) {
    res.status(500).json(err); 
  }
});

// delete Order
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted..")
  }
  catch(err) {
    res.status(500).json(err)
  }
});

// get  Order
router.get('/find:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ id: req.params.id });
    res.status(200).json(orders);
  }
  catch(err) {
    res.status(500).json(err)
  }
});

// get all orders
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  const orders = await Order.find();
  try {
    res.status(200).json(orders);
  }
  catch(err) {
    res.status(500).json(err);
  }
})

// get montly income 
router.get('/income', async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try{
    const income = await Order.aggregate([
      { $match: {createdAt: { $gte: previousMonth }}},
      { $project: { month: { $month: "$createdAt" }, sales: "$amount" }},
      { $group: { _id: "$month", total: {$sum: "$sales" } }}
    ]);
    res.status(200).json(income);
  }
  catch(err) {
    res.status(500).json(err.message);
  }
})


// export routes
module.exports = router;