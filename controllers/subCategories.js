const cateogry = require("../models/cateogry");
const subCategory = require("../models/subCategory");


exports.createSubCategories = async (req,res) => {
    try {
        //fetching data
        const { name, desc,categorId } = req.body;
        //vallidatin
        if(!name || !desc){
            return res.status(500).json({
                success:false,
                message:"all filds are required"
            })
        }
        // create subCategories
        const newSubcategory = await subCategory.create({name:name,desc:desc});

        // pushing category 
        await cateogry.findByIdAndUpdate(
            {_id:categorId},
            {
                $push:{
                    subCategorys:newSubcategory._id  
                }
            },
            {new:true}
        )
        
        //return resonpse
        return res.status(200).json({
            success:true,
            message:"subCategories are created successfully",
            newSubcategory 
        })

    } catch (err) {
        console.log("err occured in creating categoris", err);
        return res.status(500).json({
            success: false,
            message: "error occured in creating Subcategoris"
        })
    }
}

//update subcategories 
exports.updateSubCategoris = async(req,res) =>{
    try{
       //fetchign data
    const {name,desc,SubcategoryId} = req.body;
    //valldating
    if(!name || !desc){
        return res.status(500).json({
            success:false,
            message:"all filds are required"
        })
    }

    const isSubcategoryExist = await subCategory.findById(SubcategoryId);
    
    if(!isSubcategoryExist){
        return res.status(500).json({
            success:false,
            message:"this subCategory is not exist"
        })
    }
    const Subcategory = await subCategory.findByIdAndUpdate(SubcategoryId,{name:name,desc:desc},{new:true})
    console.log(Subcategory)

    return res.status(200).json({
        success:true,
        message:"SubCategories are updated successfully",
        Subcategory 
    })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"error occured in updating Subcategoris"
        })
    }
}


// delating categories

exports.deleteSubCategory = async(req,res) =>{
    try{
       const {subCategoryId} = req.body;

       if(!subCategoryId){
        return res.status(500).json({
            success:false,
            message:"subcategoryId is required"
        })
       }
       
    const isSubcategoryExist = await subCategory.findById(subCategoryId);
    
    if(!isSubcategoryExist){
        return res.status(500).json({
            success:false,
            message:"this subCategory is not exist"
        })
    }

       await subCategory.findByIdAndDelete(subCategoryId);

       return res.status(200).json({
        success:true,
        message:"SubCategories are delated",
         
    })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"error occured in delating Subcategoris"
        }) 
    }
}

// fetching categoriesWise subCategories
exports.categoryWiseSubCategories = async(req,res) =>{
    try{
     //fetching data
    const {categoryId} = req.body;

    if(!categoryId){
        return res.status(500).json({
            success:false,
            message:"all subCategory returned suceesfully"
        })
    }

    const iscategoryExist = await cateogry.findById(categoryId);
    
    if(!iscategoryExist){
        return res.status(500).json({
            success:false,
            message:"this  is not vallid category"
        })
    }

    const subCategoryes = await cateogry.findById(categoryId).populate("subCategorys").exec();
    console.log(subCategoryes)

    return res.status(200).json({
        success:true,
        message:"all sub Category returned",
        subCategoryes
    })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"error occured in fetching Subcategoris"
        }) 
    }
}