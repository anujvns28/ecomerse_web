const express = require("express");
const { createCategoris, updateCategoris, deleteCategory, fetchAllCateories } = require("../controllers/categoris");
const { createSubCategories, updateSubCategoris, deleteSubCategory, categoryWiseSubCategories } = require("../controllers/subCategories");
const router =  express.Router();

// ********************************************************************************************************
//                                    Categories
// ********************************************************************************************************
//creating categores
router.post("/createCategory",createCategoris);
//update categores
router.post("/updateCategory",updateCategoris);
//delete categores
router.post("/deleteCategories",deleteCategory);
//fetchall categories
router.get("/fetchallCategory",fetchAllCateories);

// ********************************************************************************************************
//                                    subCategories
// ********************************************************************************************************
//creating categores
router.post("/createSubCategory",createSubCategories);
//update categores
router.post("/updateSubCategory",updateSubCategoris);
//delete categores
router.post("/deleteSubCategories",deleteSubCategory);
//fetchall categories
router.post("/fetchallSubCategory",categoryWiseSubCategories);


module.exports = router