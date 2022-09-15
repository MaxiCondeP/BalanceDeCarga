import mongoose from "mongoose";
import { config } from '../config.js';

try {
    mongoose.connect(config.mongo.uri, config.mongo.options);
    console.log("Connected ok to mongoDB");
} catch (error) {
    console.log(error);
};

const schemaMessage = new mongoose.Schema({
    author: {
        email: { type: String, required: true },
        name: { type: String, max: 100 },
        lastname: { type: String, max: 100 },
        age: { type: Number, max: 100 },
        alias: { type: String, max: 100 },
        avatar: { type: String, }
    },
    text: { type: String, required: true },
    date: { type: String, max: 100 }
});

export class Message {
    constructor(mail, name, lastname, age, alias, avatar, text) {
        this.author = {
            email: mail,
            name: name,
            lastname: lastname,
            age: age,
            alias: alias,
            avatar: avatar
        }
        this.text = text;
        this.date = new Date().toLocaleString();
    }

}

export class mongoMessageContainer {
    constructor() {
        this.collection = mongoose.model('messages', schemaMessage);
    }


    ///traigo todos los msj del archivo
    async getAll() {
        try {
            const content = await this.collection.find();
            return (content);;
        }
        catch (err) {
            console.log("Error al leer historial de mensajes", err);
        }
    }

    async save(message) {
        try {
            const newElement = new this.collection(message);
            await newElement.save();
            //{author: message.author,text: message.text,date: message.date};
        }
        catch (err) {
            console.log("Error al actualizar historial de mensajes", err);

        }

    }
}