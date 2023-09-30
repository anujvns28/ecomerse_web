const Cateogry = require("../models/cateogry");
const SubCategory = require("../models/subCategory");
const Product = require("../models/product");
const User = require("../models/user");
const { uploadImageToCloudinary } = require("../utilit/imageUploader");
const { promises } = require("nodemailer/lib/xoauth2");


exports.createProduct = async (req, res) => {
    try {
        //fetching data productName
        const { productName, desc, price, subCategory, userId } = req.body;
        
        const productImages = req.files.images;
        
        //validation
        if (!productName || !desc || !price || !subCategory || !userId) {
            return res.status(500).json({
                success: false,
                message: "all filds are required"
            })
        }
        //check category is vallid or not
        const subcategorDetail = await SubCategory.findOne({ _id:subCategory });
        if (!subcategorDetail) {
            return res.status(500).json({
                success: false,
                message: "this is not vallied Subcategory "
            })
        }
        //vallidation for user
        const isUserExist = await User.findById(userId);
        if (!isUserExist) {
            return res.status(500).json({
                success: false,
                message: "this is not vallied user "
            })
        }

    const uploader = async(productImg) => await uploadImageToCloudinary(productImg , process.env.FOLDER_NAME);
    
        let proImages = []
        productImages.map(async(productImg) =>{
            const img = uploader(productImg)
           img.then(function(result){
            proImages.push(img)
           })
        })

        console.log(proImages)
        const newProduct = await Product.create({
            productName: productName,
            productDes: desc,
            price: price,
            productsImage: productImages,
            productsImages:proImages
        })

        // pushing productid in seller user scehma
        const userDetails = await User.findByIdAndUpdate(
            userId,
            {
                $push: {
                    products: newProduct._id
                }
            },
            { new: true }
        )

        await SubCategory.findByIdAndUpdate(
            subCategory,
            {
                $push: {
                    product: newProduct._id
                }
            },
            { new: true }
        )

        return res.status(200).json({
            success: true,
            message: "product created successfully",
            data: newProduct
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "error occerd in creating products"
        })
    }
}


//edit product
exports.editProduct = async (req, res) => {
    try {
        //fetching data
        const { productId, userId } = req.body;
        //image updating ???

        //validation
        const productDetails = await Product.findOne({ _id: productId });
        if (!productDetails) {
            return res.status(500).json({
                success: false,
                message: "this is not vallid product"
            })
        }


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "error occerd in editing products"
        })
    }
}


// deleting product
exports.deleteProduct = async (req, res) => {
    try {
        const { productId, userId } = req.body

        await Product.findByIdAndDelete({ _id: productId });
        await User.findByIdAndUpdate(
            { _id: userId },
            {
                $pull: {
                    user: productId
                }
            },
            { new: true }
        )
        /// categor me se delete karna hai

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "error occerd in deleting product"
        })
    }
}