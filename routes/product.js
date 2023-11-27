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
    getSubCategoryWiseProduct,
    getSingleProduct
} = require("../controllers/product");
const { isAdmin, isSeller, auth } = require("../middleWare/auth");

const router =  express.Router();

// ********************************************************************************************************
//                                    Categories
// ********************************************************************************************************
//creating categores
router.post("/createCategory",auth,isAdmin, createCategoris);
//update categores
router.post("/updateCategory",auth, isAdmin,updateCategoris);
//delete categores
router.post("/deleteCategories",auth,isAdmin, deleteCategory);
//fetchall categories
router.get("/fetchallCategory", fetchAllCateories);

// ********************************************************************************************************
//                                    subCategories
// ********************************************************************************************************
//creating categores
router.post("/createSubCategory",auth,isAdmin, createSubCategories);
//update categores
router.post("/updateSubCategory",auth,isAdmin, updateSubCategoris);
//delete categores
router.post("/deleteSubCategories",auth,isAdmin, deleteSubCategory);
//fetchall categories
router.post("/fetchallSubCategory",categoryWiseSubCategories);


// ********************************************************************************************************
//                                    createProduct
// ********************************************************************************************************
//creating product
router.post("/createProduct", createProduct);
//deleating product
router.post("/deleteProduct", deleteProduct)
//updating product
router.post("/editProduct",auth,isSeller, editProduct)
//fetching allProdcuts
router.get("/fetchAllProducts", getAllProduct)
//fetching getUserProduct
router.get("/getuserProducts",auth, userProducts)
//fetching getSubCategoryWiseProduct
router.post ("/getSubCategoryWiseProduct",getSubCategoryWiseProduct)
// fetching single product details
router.post("/getSingleProductDetails",getSingleProduct)
// userProducts
router.post("/getUserProduct",userProducts)

module.exports = router