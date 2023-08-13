const router = require('express').Router();
const Product = require('../models/Product');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

// CREATE 
router.post('/', async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  }
  catch(err) {
    console.log(err.message);
    res.status(500).json(err);
  }
});

// update an user 
router.put('/:id', verifyTokenAndAdmin,async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    return res.status(200).json(updatedProduct);
  } 
  catch(err) {
    res.status(500).json(err); 
  }
});

// delete product
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted..")
  }
  catch(err) {
    res.status(500).json(err)
  }
});

// get product
router.get('/find:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  }
  catch(err) {
    res.status(500).json(err)
  }
});

// get all product 
router.get('/', async (req, res) => {
  const queryNew = req.query.new;
  const queryCategory = req.query.category;
  try {
    let products;
    if(queryNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    }
    else if(queryCategory) {
      products = await Product.find({ categories: { $in: [queryCategory]}});
    }
    else {
      products = await Product.find();
    }
    res.status(200).json(products);
  }
  catch(err) {
    res.status(500).json(err)
  }
});

// export routes
module.exports = router;