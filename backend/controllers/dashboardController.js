const { Op, fn, col, literal } = require("sequelize");
const Order = require("../models/Order");

exports.getDashboardStats = async (req, res) => {
    try {
        const { filter, fromDate, toDate } = req.query;
        let startDate, endDate;
        const today = new Date();

        if (filter === "weekly") {
            startDate = new Date(today.setDate(today.getDate() - 7));
            endDate = new Date();
        } else if (filter === "monthly") {
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = new Date();
        } else if (filter === "yearly") {
            startDate = new Date(today.getFullYear(), 0, 1);
            endDate = new Date();
        } else if (filter === "custom" && fromDate && toDate) {
            startDate = new Date(fromDate);
            endDate = new Date(toDate);
        } else {
            startDate = new Date("2024-01-01");
            endDate = new Date();
        }

        // ✅ Total Orders & Sales
        const orders = await Order.findAll({
            where: { createdAt: { [Op.between]: [startDate, endDate] } }
        });

        const totalOrders = orders.length;
        const totalSales = orders.reduce((sum, o) => sum + o.totalPrice, 0);

        // ✅ Status Count
        const shippedOrders = orders.filter(o => o.status.toLowerCase() === "shipped").length;
        const deliveredOrders = orders.filter(o => o.status.toLowerCase() === "delivered").length;
        const cancelledOrders = orders.filter(o => o.status.toLowerCase() === "cancelled" || o.status.toLowerCase() === "pending").length;


        console.log("Order Statuses:", orders.map(o => o.status));


        // ✅ Group By Month for Chart
        const salesData = await Order.findAll({
            attributes: [
                [fn("DATE_FORMAT", col("createdAt"), "%Y-%m"), "month"],
                [fn("SUM", col("totalPrice")), "amount"]
            ],
            where: { createdAt: { [Op.between]: [startDate, endDate] } },
            group: [literal("month")],
            order: [[literal("month"), "ASC"]]
        });

        res.json({
            totalOrders,
            totalSales: totalSales.toFixed(2),
            shippedOrders,
            deliveredOrders,
            cancelledOrders,
            filter,
            fromDate: startDate,
            toDate: endDate,
            salesData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};