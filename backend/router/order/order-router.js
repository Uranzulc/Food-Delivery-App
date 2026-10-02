import express from "express";

import requireToken from "../../middleware/require-token.js";
import requireAdmin from "../../middleware/require-admin.js";

import createOrder from "../../controllers/order/create-order.js";
import getMyOrders from "../../controllers/order/get-my-orders.js";
import getAllOrders from "../../controllers/order/get-all-orders.js";
import updateOrderStatus from "../../controllers/order/update-order-status.js";

const router = express.Router();

router.post("/", requireToken, createOrder);
router.get("/me", requireToken, getMyOrders);
router.get("/", requireToken, requireAdmin, getAllOrders);
router.patch("/:id", requireToken, requireAdmin, updateOrderStatus);

export default router;
