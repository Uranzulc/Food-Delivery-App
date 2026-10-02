import express from "express";

import requireToken from "../../middleware/require-token.js";
import requireAdmin from "../../middleware/require-admin.js";

import getCategories from "../../controllers/food-category/get-categories.js";
import createCategory from "../../controllers/food-category/create-category.js";
import updateCategory from "../../controllers/food-category/update-category.js";
import deleteCategory from "../../controllers/food-category/delete-category.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", requireToken, requireAdmin, createCategory);
router.put("/", requireToken, requireAdmin, updateCategory);
router.delete("/", requireToken, requireAdmin, deleteCategory);

export default router;
