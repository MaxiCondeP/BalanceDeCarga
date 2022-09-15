import mongoose from "mongoose";
import {config} from '../config.js';

try {
    mongoose.connect(config.mongo.uri, config.mongo.options);
    console.log("Connected ok to mongoDB");
} catch (error) {
    console.log(error);
};


const schemaProduct = new mongoose.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true, max: 100 },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true, max: 400 }
});

///Creo la clase Producto
export class Product {
    constructor(name, price, thumb, stock, id) {
        this.title = name;
        this.price = price;
        this.thumbnail = thumb;
        this.id= id
    }

}
///creo la clase Contenedor

export class mongoProductContainer {
    constructor() {
        this.collection = mongoose.model('products', schemaProduct);
    }

    ///Traigo el archivo y devuelvo el array.
    async getAll() {
        try {
            const content = await this.collection.find();
            return (content);
        }
        catch (err) {
            console.log("Error al traer datos de la base", err)
            return { error: "Error al traer datos de la base", err }
        }
    }


    ////Agrego producto al array
    async save(product) {
        try {
            const content = await this.getAll();
            //Defino el valor del id en base al contenido del archivo
            let lastId = 1;
            if (content.length > 0) {
                lastId = content[content.length - 1].id + 1;
            }
            let newProduct = new Product(product.title, product.price,product.thumbnail,product.stock, lastId)
            //agrego el producto a la mongo
            const newElement = new this.collection(newProduct);
            await newElement.save();
            //muestro el último id
            console.log(`El último id es: ${lastId}`);
            return lastId;
        } catch (err) {
            console.log("Error al modificar el archivo", err);
            return { error: "Error al modificar el archivo", err }
        }
    }

    ////Devuelvo un  producto por el ID
    async getByID(id) {
        try {
            let prod = await this.collection.findOne({ id: id });
          
            return prod;
        } catch (err) {
            console.log("No se encontró el product", err)
            return { error: "No se encontró el product" }
        }
    }

   
}

