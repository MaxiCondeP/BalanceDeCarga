import {config} from '../config.js'

export class Message {
    constructor(mail,name,lastname, age, alias, avatar, text) {
        this.author={
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

export class firebaseMessageContainer {
    constructor() {
        this.db = config.firebase.db;
		this.query = this.db.collection('messages');
    }


    ///traigo todos los msj del archivo
    async getAll() {
        try {
            const querySnapshot = await this.query.get();
			let docs = querySnapshot.docs;
			const content = docs.map((doc) => (doc.data()));
            return (content);
        }
        catch (err) {
            console.log("Error al leer historial de mensajes", err);
        }
    }

    async save(message) {
        try {
            const doc= this.query.doc()
            await doc.create({author: message.author,text: message.text,date: message.date});
        }
        catch (err) {
            console.log("Error al actualizar historial de mensajes", err);

         }

    }
}