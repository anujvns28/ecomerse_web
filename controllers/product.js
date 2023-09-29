const Cateogry = require("../models/cateogry");
const Product = require("../models/product");
const User = require("../models/user");


exports.createProduct = async(req,res) =>{
    try{
//fetching data
const {productName,desc,price,categorId,userId} = req.body;
const productImages = req.files.images;
//validation
if(!productName || !desc || !price ){
    return res.status(500).json({
        success:false,
        message:"all filds are required"
    })
}
//check category is vallid or not
const categorDetail = await Cateogry.findOne({_id:categorId});
if(!categorDetail){
    return res.status(500).json({
        success:false,
        message:"this is not vallied category "
    }) 
}

const newProduct = await Product.create({
    productDes:productName,
    productDes:desc,
    price:price,
    productsImage:productImages,  
})

const userDetails = await Product.findByIdAndUpdate(
    {_id:userId},
    {
        $push:{
        user:newProduct._id
    }},
    {new:true}
)

await Cateogry.findOneAndUpdate(
    {_id:categorId},
    {
        $push:{
            category:categorDetail._id
        }
    },
    {new:true}
    )

    return res.status(200).json({
            success:true,
            message:"product created successfully",
            data:newProduct
    })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"error occerd in creating products"
        })
    }
}


//edit product
exports.editProduct = async(req,res) =>{
    try{
    //fetching data
    const {productId,userId} = req.body;
    //image updating ???

    //validation
    const productDetails = await Product.findOne({_id:productId});
    if(!productDetails){
        return res.status(500).json({
            success:false,
            message:"this is not vallid product"
        })
    }

    
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"error occerd in editing products"
        }) 
    }
}


// deleting product
exports.deleteProduct = async(req,res) =>{
    try{
    const {productId,userId} = req.body

    await Product.findByIdAndDelete({_id:productId});
    await User.findByIdAndUpdate(
        {_id:userId},
        {
            $pull:{
                user:productId
            }
        },
        {new:true}
    )
    /// categor me se delete karna hai

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"error occerd in deleting product"
        }) 
    }
}