import { Cart } from "../../models/cart";
import { Product } from "../../models/product";
import { Reduction } from "../../models/reduction";
import { Store } from "../../models/store";


class services {
    static async getCartItem(id: string) {
        const cartItem = await Cart.findOne({ _id: id }).exec();
        if (!cartItem) {
            throw new Error("Cart item not found")
        }

        const reduction = await Reduction.findOne({ _id: cartItem.reductionId }).exec();
        if (!reduction) {
            throw new Error("Reduction not found")
        }

        const product = await Product.findOne({ _id: reduction.productId }).exec();
        if (!product) {
            throw new Error("Product not found")
        }

        const store = await Store.findOne({ _id: product.storeId }).exec();
        if (!store) {
            throw new Error("Store not found")
        }

        return {
            id: id,
            amount: cartItem.amount,
            reductionId: reduction.id,
            stock: reduction.stock,
            price: reduction.price,
            expirationDate: reduction.expirationDate,
            productId: reduction.productId,
            name: product.name,
            productPrice: product.price,
            detail: product.detail,
            storeId: product.storeId,
            storeName: store.name,
        }
    }
    
    static async getCartItemList(userId: string) {
        let list = await Cart.find({ userId: userId }).exec();

        let cartItemList = []
        for(let i=0; i<list.length; i++) {
            let cartItem = await this.getCartItem(list[i]._id)
            cartItemList.push(cartItem)
        }
        
        return cartItemList
    }
    
    static async checkItemSameStore(
        userId: string,
        reductionId: string,
    ) {
        
        const cartItemList = await Cart.find({ userId: userId }).exec();

        const reduction = await Reduction.findOne({ _id: reductionId }).exec();

        if (!reduction) {
            throw new Error("Reduction not found")
        }

        if (cartItemList.length > 0) {
            if (cartItemList[0].storeId !== reduction.storeId) {
                return false
            }
        }

        return true
    }
    
    static async addItemToCart(
        userId: string,
        reductionId: string,
        amount: number,
    ) {
        const cartItem = await Cart.findOne({ userId: userId, reductionId: reductionId }).exec();
        if (cartItem) {
            let updatedCartItem = await this.updateCartItem(
                userId,
                cartItem._id,
                cartItem.amount + amount,
            )
            return updatedCartItem
        }
        
        const cartItemList = await Cart.find({ userId: userId }).exec();

        const reduction = await Reduction.findOne({ _id: reductionId }).exec();

        if (!reduction) {
            throw new Error("Reduction not found")
        }
        
        if (reduction.stock < amount) {
            throw new Error("Not enough")
        }

        if (cartItemList.length > 0) {
            if (cartItemList[0].storeId !== reduction.storeId) {
                this.deleteAllCartItem(userId)
            }
        }

        const newCartItem = new Cart({
            userId: userId,
            storeId: reduction.storeId,
            reductionId: reductionId,
            amount: amount,
        });
        await newCartItem.save();

        return await Cart.findOne({ _id: newCartItem._id }).exec()
    }
    
    static async updateCartItem(
        userId: string,
        cartItemId: string,
        amount: number,
    ) {
        const cartItem = await Cart.findOne({ _id: cartItemId }).exec();
        if (!cartItem) {
            throw new Error("Cart item not found")
        }

        const reduction = await Reduction.findOne({ _id: cartItem.reductionId }).exec();
        if (!reduction) {
            throw new Error("Reduction not found")
        }

        if (reduction.stock < amount) {
            throw new Error("Not enough")
        }

        if (amount === 0) {
            const deletedCartItem = await this.deleteCartItem(userId, cartItemId)
            return deletedCartItem
        }

        const newValues = {$set: {
            userId: userId,
            storeId: cartItem.storeId,
            reductionId: cartItem.reductionId,
            amount: amount,
        }}
        const updatedCartItem = await Cart.updateOne({ _id: cartItemId }, newValues);

        return updatedCartItem
    }
    
    static async deleteCartItem(
        userId: string,
        cartItemId: string,
    ) {
        const cartItem = await Cart.findOne({ _id: cartItemId }).exec();
        if (cartItem) {
            throw new Error("Cart item not found")
        }

        const deletedCartItem = await Cart.deleteOne({ _id: cartItemId });

        return deletedCartItem
    }
    
    static async deleteAllCartItem(userId: string) {
        const deletedCartItem = await Cart.deleteMany({ userId: userId });

        return deletedCartItem
    }

}

module.exports = services