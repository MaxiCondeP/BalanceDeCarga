import * as fs from 'fs';


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

export class fileMessageContainer {
    constructor(nombreArchivo) {
        this.nombre = nombreArchivo;
        this.rutaDeArchivo = "./public/" + this.nombre + ".txt";
    }


    ///traigo todos los msj del archivo
    async getAll() {
        try {
            const archivo = await fs.promises.readFile(this.rutaDeArchivo, 'utf-8');
            const chat = JSON.parse(archivo);
            return chat;
        }
        catch (err) {
            console.log("Error al leer historial de mensajes", err);
        }
    }

    async save(message) {
        try {
            const messages = await this.getAll();
            //genero el id para cada msj
            messages.push(message);
            const newFile=JSON.stringify(messages, null, "\t");
            await fs.promises.writeFile(this.rutaDeArchivo, newFile);

        }
        catch (err) {
            console.log("Error al actualizar historial de mensajes", err);

         }

    }
}