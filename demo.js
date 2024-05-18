import mongoose from "mongoose";
import OrderModel from "./db/models/order.model.js";

// Assuming you have a Company model
import CompanyModel from "./db/models/user.model.js";

async function getOrdersForCompany(companyId) {
    try {
        const orders = await OrderModel.aggregate([
            {
                $lookup: {
                    from: "products", // Assuming the name of your product collection is "products"
                    localField: "orderItems.product",
                    foreignField: "_id",
                    as: "products"
                }
            },
            {
                $match: {
                    "products.createdBy": mongoose.Types.ObjectId(companyId)
                }
            }
        ]);

        return orders;
    } catch (error) {
        console.error("Error fetching orders for company:", error);
        throw error;
    }
}

// Usage example
const companyId = "6634107009db7b6a65bae827"; // Replace with the actual company ID
getOrdersForCompany(companyId)
    .then(orders => {
        console.log("Orders for company:", orders);
    })
    .catch(error => {
        console.error("Error:", error);
    });

    