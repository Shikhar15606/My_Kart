const express = require('express');
const router = express.Router();
const { Product } = require("../models/Product");
const cloudinary = require('cloudinary')

const { auth, isadmin } = require("../middleware/auth");
const { User } = require('../models/User');
const { forEach } = require('async');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
});

//=================================
//             Product
//=================================


router.post("/uploadProduct", auth, isadmin, (req, res) => {

    //save all the data we got from the client into the DB 
    const product = new Product(req.body)

    product.save((err) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true })
    })

});


router.post("/getProducts", (req, res) => {

    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "views";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);

    let findArgs = {};
    let term = req.body.searchTerm;

    for (let key in req.body.filters) {

        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    console.log(findArgs)

    if (term) {
        Product.find(findArgs)
            .find({ $text: { $search: term } })
            .populate("writer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, products) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, products, postSize: products.length })
            })
    } else {
        Product.find(findArgs)
            .populate("writer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, products) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, products, postSize: products.length })
            })
    }

});


//?id=${productId}&type=single
//id=12121212,121212,1212121   type=array 
router.get("/products_by_id", (req, res) => {
    let type = req.query.type
    let productIds = req.query.id
    console.log("req.query.id", req.query.id)

    if (type === "array") {
        let ids = req.query.id.split(',');
        productIds = [];
        productIds = ids.map(item => {
            return item
        })
        //we need to find the product information that belong to product Id 
        Product.find({ '_id': { $in: productIds } })
            .populate('writer')
            .exec((err, product) => {
                console.log(product)
                if (err) return res.status(400).send(err)
                return res.status(200).send(product)
            })
    }
    else {
        Product.findOneAndUpdate({ '_id': { $in: productIds } }, { $inc: { views: 1 } })
            .populate('writer')
            .exec((err, product) => {
                console.log(product)
                if (err) return res.status(400).send(err)
                return res.status(200).send(product)
            })
    }
});

const deletefiles = (path) => {
    cloudinary.v2.uploader.destroy(path, (err, response) => {
        if (err) console.log(err)
        if (response) console.log(response)
        return
    })
}

router.get("/delete/:product_id", (req, res) => {
    let id = req.params.product_id;
    console.log("req.params.id", id)
    Product.findOne({ _id: id }, (err, product) => {
        if (err)
            return res.status(200).json({ err: err })
        else {
            product.images.map(deletefiles)
            User.find({}, (err, users) => {
                if (err) {
                    return res.status(200).json({ err: err })
                }
                users.forEach((user) => {
                    {
                        User.findOneAndUpdate(
                            { '_id': { $in: [user] } },
                            {
                                "$pull":
                                    { "cart": { "id": req.params.product_id } }
                            }
                        )
                            .exec(() => {
                                console.log("\nWorked")
                            })

                    }
                })
            })
                .exec((err, success) => {
                    Product.deleteOne(product, (err, success) => {
                        if (err) {
                            return res.status(200).json({ err: err })
                        }
                        return res.status(200).json({ success: true })
                    })
                    console.log("\nerror : ", err)
                    console.log("\nChala : ", success)
                })
        }
    })
});

router.post("/stock/:product_id", (req, res) => {
    let id = req.params.product_id;
    let newstock = req.body.newstock;
    let newprice = req.body.newprice;
    Product.findByIdAndUpdate({ '_id': id }, { $set: { 'stock': newstock, 'price': newprice } }, (err, product) => {
        if (err) return res.status(200).json({ err: err })
        User.find({}, (err, users) => {
            if (err) return res.status(200).json({ err: err })
            users.forEach((user) => {
                {
                    User.findOne({ '_id': { $in: [user] } })
                        .exec((err, user) => {
                            if (err) return res.status(200).json({ err: err })
                            let cart = user.cart;
                            let array = cart.map(item => {
                                return ({ id: item.id, quantity: item.quantity })
                            })
                            array.forEach((item) => {
                                Product.findOne({ '_id': item.id })
                                    .exec((err, ItemDetail) => {
                                        if (err) return res.status(400).send(err);
                                        if (item.quantity > ItemDetail.stock) {
                                            User.findOneAndUpdate({ '_id': user._id }, { "$pull": { "cart": { "id": item.id } } }, { new: true },
                                                (err, userInfo) => {
                                                    if (err) return res.status(400).send(err);
                                                })
                                        }
                                    })
                            })
                        })
                }
            })
        })
            .exec((err, success) => {
                if (err) return res.status(200).json({ err: err })
                return res.status(200).json({ success: true, err: false })
            })
    })
});


module.exports = router;
