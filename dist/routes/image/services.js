"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const image_1 = require("../../models/image");
class services {
    static addImage(image, name) {
        return __awaiter(this, void 0, void 0, function* () {
            let finalImg = formatFileUpload(image);
            const newImage = new image_1.Image({
                name: name + '-' + Date.now(),
                img: finalImg,
            });
            yield newImage.save();
            return yield image_1.Image.findOne({ _id: newImage._id }).exec();
        });
    }
    static deleteImage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield image_1.Image.findOne({ _id: id }).exec();
            if (!image) {
                throw new Error("Image not found");
            }
            const deletedImage = yield image_1.Image.deleteOne({ _id: id });
            return deletedImage;
        });
    }
}
module.exports = services;
