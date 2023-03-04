import { Cart } from "../../models/cart";
import { IOrder, Order } from "../../models/order";
import { Product } from "../../models/product";
import { Reduction } from "../../models/reduction";
import { Store } from "../../models/store";
import { User } from "../../models/user";

const ReductionServices = require('../reduction/services')

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
        }
        
        return updatedOrder
    }
}

module.exports = services