import { Cart } from "../../models/cart";
import { Product } from "../../models/product";
import { IReduction, Reduction } from "../../models/reduction";
import { Store } from "../../models/store";


class services {
    static async getReduction(id: string) {
        const reduction = await Reduction.findOne({ _id: id }).exec();
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
            id: reduction.id,
            stock: reduction.stock,
            price: reduction.price,
            expirationDate: reduction.expirationDate,
            productId: reduction.productId,
            name: product.name,
            productPrice: product.price,
            detail: product.detail,
            image: product.image,
            storeId: product.storeId,
            storeName: store.name
        }
    }
    
    static async getReductionList(storeId?: string) {
        let list = null
        let reductionList = []
        if (storeId) {
            list = await Reduction.find({ storeId: storeId }).exec();
        } else {
            list = await Reduction.find().exec();
        }

        for(let i=0; i<list.length; i++) {
            let reduction = await this.getReduction(list[i]._id)
            reductionList.push(reduction)
        }
        
        return reductionList
    }
    
    static async addReduction(
        storeId: string,
        productId: string,
        stock: number,
        price: number,
        expirationDate: Date,
    ) {
        const product = await Product.findOne({ _id: productId }).exec();

        if (!product || product.storeId !== storeId) {
            throw new Error("Product not found")
        }

        const reduction: IReduction = new Reduction({
            productId: productId,
            storeId: product.storeId,
            stock: stock,
            price: price,
            expirationDate: expirationDate,
        });
        await reduction.save();

        return await Reduction.findOne({ _id: reduction._id }).exec()
    }
    
    static async updateReduction(
        storeId: string,
        id: string,
        productId: string,
        stock: number,
        price: number,
        expirationDate: Date,
    ) {
        const reduction = await Reduction.findOne({ _id: id }).exec();
        if (!reduction) {
            throw new Error("Reduction not found")
        }

        const product = await Product.findOne({ _id: productId || reduction.productId }).exec();
        if (!product || product.storeId !== storeId) {
            throw new Error("Product not found")
        }

        const newValues = {$set: {
            productId: productId || reduction.productId,
            storeId: product.storeId,
            stock: stock || reduction.stock,
            price: price || reduction.price,
            expirationDate: expirationDate || reduction.expirationDate,
        }}
        const updatedReduction = await Reduction.updateOne({ _id: id }, newValues);

        return updatedReduction
    }
    
    static async deleteReduction(
        storeId: string,
        id: string,
    ) {
        const reduction = await Reduction.findOne({ _id: id }).exec();
        if (!reduction) {
            throw new Error("Reduction not found")
        }

        const product = await Product.findOne({ _id: reduction.productId }).exec();
        if (!product || product.storeId !== storeId) {
            throw new Error("Product not found")
        }

        const cartItem = await Cart.deleteMany({ reductionId: id });
        const deletedReduction = await Reduction.deleteOne({ _id: id });

        return deletedReduction
    }

}

module.exports = services