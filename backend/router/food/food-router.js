import express from "express";

import requireToken from "../../middleware/require-token.js";
import requireAdmin from "../../middleware/require-admin.js";

import getFoods from "../../controllers/food/get-foods.js";
import getFood from "../../controllers/food/get-food.js";
import createFood from "../../controllers/food/create-food.js";
import updateFood from "../../controllers/food/update-food.js";
import deleteFood from "../../controllers/food/delete-food.js";

const router = express.Router();

router.get("/", getFoods);
router.get("/:id", getFood);
router.post("/", requireToken, requireAdmin, createFood);
router.put("/:id", requireToken, requireAdmin, updateFood);
router.delete("/:id", requireToken, requireAdmin, deleteFood);

export default router;
