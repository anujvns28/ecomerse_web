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
        const subcategorDetail = await SubCategory.findOne({ _id: subCategory });
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

        const uploader = async (productImg) => await uploadImageToCloudinary(productImg, process.env.FOLDER_NAME);

        let proImages = []
        productImages.map(async (productImg) => {
            const img = uploader(productImg)
            img.then(async function (result) {
                proImages.push(result.secure_url)
                if (productImages.length === proImages.length) {
                    createProduct()
                }
            })
        })

        const createProduct = async () => {
            const newProduct = await Product.create({
                productName: productName,
                productDes: desc,
                price: price,
                productsImages: proImages,
                user: userId,
                subCategory: subCategory
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
        }

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
        const { productName, desc, price, productId } = req.body;
        const productImages = req.files.images;
        //validation
        if (!productName || !desc || !price || !productId) {
            return res.status(500).json({
                success: false,
                message: "all filds are required"
            })
        }

        //validation
        const productDetails = await Product.findOne({ _id: productId });
        if (!productDetails) {
            return res.status(500).json({
                success: false,
                message: "this is not vallid product"
            })
        }

        const uploader = async (productImg) => await uploadImageToCloudinary(productImg, process.env.FOLDER_NAME);

        let proImages = []
        productImages.map(async (productImg) => {
            const img = uploader(productImg)
            img.then(async function (result) {
                proImages.push(result.secure_url)
                if (productImages.length === proImages.length) {
                    updateProduct()
                }
            })
        })


        const updateProduct = async () => {
            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                {
                    productName: productName,
                    productDes: desc,
                    price: price,
                    productsImages: proImages,
                },
                {new:true}
            )

            return res.status(200).json({
                success: true,
                message: "product updated successfully",
                data : updatedProduct
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

        if (!productId || !userId) {
            return res.status(500).json({
                success: false,
                message: "all filds are required"
            })
        }

        const subCategoryDetail = await Product.findOne({ _id: productId })
        console.log(subCategoryDetail)

        if (!subCategoryDetail) {
            return res.status(500).json({
                success: false,
                message: "This is not vallid Product"
            })
        }

        const userDetail = await User.findOne({ _id: userId })
        if (!userDetail) {
            return res.status(500).json({
                success: false,
                message: "This is not vallid user"
            })
        }



        await SubCategory.findByIdAndUpdate(
            subCategoryDetail.subCategory._id,
            {
                $pull: {
                    product: productId
                }
            }
        )


        await User.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    products: productId
                }
            },
            { new: true }
        )

        await Product.findByIdAndDelete(productId);

        return res.status(500).json({
            success: true,
            message: "product delteed successfully"
        })


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "error occerd in deleting product"
        })
    }
}



// getting all products
exports.getAllProduct = async(req,res) =>{
    try{
        const allProducts = await Product.find().populate("user").exec()
        console.log(allProducts)

        return res.status(200).json({
            success:true,
            message:"all product fetched successfully",
            allProducts
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "error occerd in fetching all  product"
        })
    }
}

// get user product
exports.userProducts = async(req,res) =>{
    try{
       //fetching data
        const {userId} = req.body;
        
        //vallidation
        if(!userId){
            return res.status(500).json({
                success:false,
                message:"all fild are required"
            })
        }

        const userDetails = await User.findById(userId).populate("products").exec();

        return res.status(200).json({
            success:true,
            message:"products fetched successfully",
            products:userDetails
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "error occerd in fetching all  product"
        })
    }
}

// get SubCategorwiseproduct
exports.getSubCategoryWiseProduct = async(req,res) =>{
    try{
        //fetchingdata
        const {subCategoryId}= req.body;

        //vallidation
        if(!subCategoryId){
            return res.status(500).json({
                success: false,
                message: "Sub Category is required"
            }) 
        }
        
        const subCategoryProducts = await SubCategory.findById(subCategoryId).populate("product").exec();

        if(!subCategoryProducts){
            return res.status(500).json({
                success: false,
                message: "Sub Category is not vallid"
            }) 
        }

        return res.status(200).json({
            success:true,
            message:"Product fetched successfulyy",
            subCategoryProducts
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "error occerd in fetching subCategories wise product"
        })
    }
}

