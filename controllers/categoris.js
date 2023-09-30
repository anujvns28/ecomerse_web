const cateogry = require("../models/cateogry");
const subCategory = require("../models/subCategory");

exports.createCategoris = async(req,res) =>{
try{
    //fetchign data
    const {categoryName,categoryDes} = req.body;
    //valldating
    if(!categoryName || !categoryDes){
        return res.status(500).json({
            success:false,
            message:"all filds are required"
        })
    }
    const category = await cateogry.create({categoryName:categoryName,categoryDes:categoryDes})
    console.log(category)

    return res.status(200).json({
        success:true,
        message:"Categories are created successfully",
        category 
    })
}catch(err){
    console.log("err occured in creating categoris",err);
    return res.status(500).json({
        success:false,
        message:"error occured in creating categoris"
    })
}
}

//update categories 
exports.updateCategoris = async(req,res) =>{
    try{
       //fetchign data
    const {categoryName,categoryDes,categoryId} = req.body;
    //valldating
    if(!categoryName || !categoryDes){
        return res.status(500).json({
            success:false,
            message:"all filds are required"
        })
    }
    const isCategoryExist = await cateogry.findById(categoryId);
    
    if(!isCategoryExist){
        return res.status(500).json({
            success:false,
            message:"this Category is not exist"
        })
    }
    const category = await cateogry.findByIdAndUpdate(categoryId,{categoryName:categoryName,categoryDes:categoryDes},
    {new:true})
    console.log(category)

    return res.status(200).json({
        success:true,
        message:"Categories are updated successfully",
        category 
    })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"error occured in updating categoris"
        })
    }
}

// delating categories

exports.deleteCategory = async(req,res) =>{
    try{
        const {categoryId} = req.body;
       await cateogry.findByIdAndDelete(categoryId);

       return res.status(200).json({
        success:true,
        message:"Categories are delated",
         
    })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"error occured in delating categoris"
        }) 
    }
}

// fetchig allCategorys
exports.fetchAllCateories = async(req,res) =>{
    try{
       const categoies = await cateogry.find();
       
       return res.status(200).json({
        success:true,
        message:"Categories are fetched successfully",
        categoies
       })
    // 
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"error occured in fetching categoris"
        }) 
    }
}
