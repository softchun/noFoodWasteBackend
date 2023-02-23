import { Product } from "../../models/product";
import { Reduction } from "../../models/reduction";

class services {
    static async getProduct(
        storeId: string,
        id: string,
    ) {
        const product = await Product.findOne({ _id: id }).exec();

        if (!product || product.storeId !== storeId) {
            throw new Error("Product not found")
        }

        const reductions = await Reduction.find({ productId: product._id  }).exec();

        return {
            id: product._id,
            storeId: product.storeId,
            name: product.name,
            price: product.price,
            detail: product.detail,
            image: product.image,
            reductions: reductions
        }
    }
    
    static async getProductList(storeId: string) {
        const list = await Product.find({ storeId }).exec();
        let productList = []
        for(let i=0; i<list.length; i++) {
            let product = await this.getProduct(storeId, list[i]._id)
            productList.push(product)
        }

        return productList
    }
    
    static async addProduct(
        storeId: string,
        name: string,
        price: number,
        detail: string,
        image: string,
    ) {
        const product = new Product({
            storeId: storeId,
            name: name,
            price: price,
            detail: detail,
            image: image,
        });
        await product.save();

        return await Product.findOne({ _id: product._id }).exec()
    }
    
    static async updateProduct(
        storeId: string,
        id: string,
        name: string,
        price: number,
        detail: string,
        image: string,
    ) {
        const product = await Product.findOne({ _id: id }).exec();

        if (!product || product.storeId !== storeId) {
            throw new Error("Product not found")
        }

        const newValues = {$set: {
            name: name || product.name,
            price: price || product.price,
            detail: detail || product.detail,
            image: image || product.image,
        }}
        const updatedProduct = await Product.updateOne({ _id: id }, newValues);

        return updatedProduct
    }
    
    static async deleteProduct(
        storeId: string,
        id: string,
    ) {
        const product = await Product.findOne({ _id: id }).exec();

        if (!product || product.storeId !== storeId) {
            throw new Error("Product not found")
        }

        const reductions = await Reduction.deleteMany({ productId: id });
        const deletedProduct = await Product.deleteOne({ _id: id });

        return deletedProduct
    }

}

module.exports = services