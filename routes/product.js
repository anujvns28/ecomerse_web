const express = require("express");
const { 
    createCategoris, 
    updateCategoris, 
    deleteCategory, 
    fetchAllCateories 
} = require("../controllers/categoris");

const { 
    createSubCategories, 
    updateSubCategoris, 
    deleteSubCategory, 
    categoryWiseSubCategories 
} = require("../controllers/subCategories");

const { 
    createProduct, 
    deleteProduct, 
    editProduct, 
    getAllProduct,  
    userProducts, 
    getSubCategoryWiseProduct
} = require("../controllers/product");
const { isAdmin, isSeller, auth } = require("../middleWare/auth");

const router =  express.Router();

// ********************************************************************************************************
//                                    Categories
// ********************************************************************************************************
//creating categores
router.post("/createCategory",isAdmin, createCategoris);
//update categores
router.post("/updateCategory", isAdmin,updateCategoris);
//delete categores
router.post("/deleteCategories",isAdmin, deleteCategory);
//fetchall categories
router.get("/fetchallCategory", fetchAllCateories);

// ********************************************************************************************************
//                                    subCategories
// ********************************************************************************************************
//creating categores
router.post("/createSubCategory",isAdmin, createSubCategories);
//update categores
router.post("/updateSubCategory",isAdmin, updateSubCategoris);
//delete categores
router.post("/deleteSubCategories",isAdmin, deleteSubCategory);
//fetchall categories
router.post("/fetchallSubCategory",categoryWiseSubCategories);


// ********************************************************************************************************
//                                    createProduct
// ********************************************************************************************************
//creating product
router.post("/createProduct",isSeller, createProduct);
//deleating product
router.post("/deleteProduct",isSeller, deleteProduct)
//updating product
router.post("/editProduct",isSeller, editProduct)
//fetching allProdcuts
router.get("/fetchAllProducts", getAllProduct)
//fetching getUserProduct
router.get("/getuserProducts",auth, userProducts)
//fetching getSubCategoryWiseProduct
router.get("/getSubCategoryWiseProduct",getSubCategoryWiseProduct)


module.exports = router