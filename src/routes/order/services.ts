import { Cart } from "../../models/cart";
import { IOrder, Order } from "../../models/order";
import { Product } from "../../models/product";
import { Reduction } from "../../models/reduction";
import { Store } from "../../models/store";
import { User } from "../../models/user";

const ReductionServices = require('../reduction/services')

const MAX_CANCEL = 2;
const NUMBER_DAY_LIMIT = 90;

class services {
    static async getOrder(id: string) {
        const order = await Order.findOne({ _id: id }).exec();
        if (!order) {
            throw new Error("Order not found")
        }

        const store = await Store.findOne({ _id: order.storeId }).exec();
        if (!store) {
            throw new Error("Store not found")
        }
        const user = await User.findOne({ _id: order.userId }).exec();
        if (!user) {
            throw new Error("User not found")
        }

        let difference = (new Date()).getTime() - (new Date(order.lastUpdate)).getTime()
        let minutesDifference = Math.floor(difference/1000/60)

        return {
            id: id,
            userId: order.userId,
            userName: user.name,
            storeId: order.storeId,
            storeName: store.name,
            status: order.status,
            reduction: order.reduction,
            lastUpdate: order.lastUpdate,
            minutesDifference: minutesDifference,
        }
    }
    
    static async getOrderList(
        userId: string,
        storeId: string,
        status: string,
    ) {
        let query: any = {}
        if (storeId) {
            query.storeId = storeId
        }
        if (userId) {
            query.userId = userId
        }
        if (status) {
            query.status = status
        }
        let list = await Order.find(query).exec();

        let orderList = []
        for(let i=0; i<list.length; i++) {
            let order = await this.getOrder(list[i]._id)
            orderList.push(order)
        }
        
        return orderList
    }
    
    static async addOrder(
        userId: string,
        storeId: string,
        reduction: Array<{
            id: string,
            amount: number,
        }>
    ) {
        const canOrder = await this.checkCanOrder(userId)
        if (!canOrder) {
            throw new Error("You can not order because you have reached the order cancellation limit.")
        }

        const store = await Store.findOne({ _id: storeId }).exec();
        if (!store) {
            throw new Error("Store not found")
        }

        let list = reduction
        let reductionList = []
        for(let i=0; i<list.length; i++) {

            if (!list[i].id || !list[i].amount) {
                throw new Error("Some required field is missing")
            }

            const reduction = await Reduction.findOne({ _id: list[i].id }).exec();
            if (!reduction) {
                throw new Error("Reduction not found")
            }
            if (reduction.stock < list[i].amount) {
                throw new Error("Not enough")
            }
            
            const product = await Product.findOne({ _id: reduction.productId }).exec();
            if (!product) {
                throw new Error("Product not found")
            }

            if (storeId !== product.storeId) {
                throw new Error("Products are not same store")
            }

            await ReductionServices.updateStock(list[i].id, reduction.stock - list[i].amount)

            reductionList.push({
                id: list[i].id,
                productId: reduction.productId,
                storeId: reduction.storeId,
                name: product.name,
                price: reduction.price,
                productPrice: product.price,
                amount: list[i].amount,
                image: product.image,
                detail: product.detail,
                expirationDate: reduction.expirationDate,
            })
        }

        const newOrder: IOrder = new Order({
            userId: userId,
            storeId: storeId,
            storeName: store.name,
            status: 'TO_ACCEPT',
            reduction: reductionList,
            lastUpdate: new Date(),
        });
        await newOrder.save();

        await Cart.deleteMany({ userId: userId });

        return await Order.findOne({ _id: newOrder._id }).exec()
    }
    
    static async updateOrderStatus(
        userId: string,
        id: string,
        newStatus: string, // status -> TO_ACCEPT, TO_PICKUP, CANCELED, COMPLETE
    ) {
        const order = await Order.findOne({ _id: id, userId: userId }).exec();
        if (!order) {
            throw new Error("Order not found")
        }
        
        if (newStatus !== 'CANCELED' || (order.status !== 'TO_ACCEPT' && order.status !== 'TO_PICKUP')) {
            throw new Error("Can not update status")
        }
        
        const newValues = {$set: {
            userId: order.userId,
            storeId: order.storeId,
            status: newStatus,
            reduction: order.reduction,
            lastUpdate: new Date(),
        }}
        const updatedOrder = await Order.updateOne({ _id: id }, newValues);

        if (newStatus === 'CANCELED') {
            let list = order.reduction
            for(let i=0; i<list.length; i++) {
                const reduction = await Reduction.findOne({ _id: list[i].id }).exec();
                if (reduction) {
                    await ReductionServices.updateStock(list[i].id, reduction.stock + list[i].amount)
                }
            }
            const getOrder = await Order.findOne({ _id: id, userId: userId }).exec();
            await this.addCancelHistoty(userId, getOrder.lastUpdate, 'customer')
        }

        return updatedOrder
    }
    
    static async updateOrderStatusStore(
        storeId: string,
        id: string,
        newStatus: string, // status -> TO_ACCEPT, TO_PICKUP, CANCELED, COMPLETE
    ) {
        const order = await Order.findOne({ _id: id, storeId: storeId }).exec();
        if (!order) {
            throw new Error("Order not found")
        }
        
        let difference = (new Date()).getTime() - (new Date(order.lastUpdate)).getTime()
        let minutesDifference = Math.floor(difference/1000/60)

        if (!(((newStatus === 'CANCELED' || newStatus === 'TO_PICKUP') && order.status === 'TO_ACCEPT')
            || (newStatus === 'COMPLETE' && order.status === 'TO_PICKUP')
            || (newStatus === 'CANCELED' && order.status === 'TO_PICKUP' && minutesDifference >= 30))
        ) {
            throw new Error("Can not update status")
        }
        
        const newValues = {$set: {
            userId: order.userId,
            storeId: order.storeId,
            status: newStatus,
            reduction: order.reduction,
            lastUpdate: new Date(),
        }}
        const updatedOrder = await Order.updateOne({ _id: id }, newValues);

        if (newStatus === 'CANCELED') {
            let list = order.reduction
            for(let i=0; i<list.length; i++) {
                const reduction = await Reduction.findOne({ _id: list[i].id }).exec();
                if (reduction) {
                    await ReductionServices.updateStock(list[i].id, reduction.stock + list[i].amount)
                }
            }
            const getOrder = await Order.findOne({ _id: id, storeId: storeId }).exec();
            await this.addCancelHistoty(getOrder.userId, getOrder.lastUpdate, 'customer')
        }
        
        return updatedOrder
    }

    static async handleCancelHistoty(
        userId: string,
    ) {
        const user = await User.findOne({ _id: userId }).exec();
        if (!user) {
            throw new Error("User not found")
        }
        if (user.cancelHistoty?.length > 0) {
            let d = new Date((user.cancelHistoty)[0].date)
            let d2 = new Date()
            
            let difference = d2.getTime() - d.getTime()
            let daysDifference = Math.floor(difference/(1000*60*60*24))     // (1000 milliseconds * 60 seconds * 60 minutes * 24 hours)

            if (
                ((d.getMonth() !== d2.getMonth() || d.getFullYear() !== d2.getFullYear()) && user.cancelHistoty?.length <= MAX_CANCEL)  // new month and cancel order not more than limit
                || daysDifference >= NUMBER_DAY_LIMIT      // after ban day
            ) {
                const newValues = {$set: {
                    cancelHistoty: []
                }}
                await User.updateOne({ _id: userId }, newValues);
            }
        }
    }
    
    static async checkCanOrder(
        userId: string,
    ) {
        await this.handleCancelHistoty(userId)
        const user = await User.findOne({ _id: userId }).exec();
        if (!user) {
            throw new Error("User not found")
        }
        if (user.cancelHistoty?.length > MAX_CANCEL) {
            return false
        }
        return true
    }

    static async addCancelHistoty(
        userId: string,
        date: Date,
        cancelBy: string,
    ) {
        await this.handleCancelHistoty(userId)
        const user = await User.findOne({ _id: userId }).exec();
        if (!user) {
            throw new Error("User not found")
        }
        let cancelHistotyList = user.cancelHistoty
        if (user.cancelHistoty?.length > 0) {
            cancelHistotyList = [
                ...cancelHistotyList,
                {
                    date: date,
                    cancelBy: cancelBy,
                }
            ]
        } else {
            cancelHistotyList = [{
                date: date,
                cancelBy: cancelBy,
            }]
        }
        const newValues = {$set: {
            cancelHistoty: cancelHistotyList
        }}
        const updatedUser = await User.updateOne({ _id: userId }, newValues);
    }
}

module.exports = services