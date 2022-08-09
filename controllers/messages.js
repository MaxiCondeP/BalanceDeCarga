import * as fs from 'fs';

export class Message {
    constructor(email, text) {
        this.email = email;
        this.text = text;
        this.date = new Date().toLocaleString();
    }

}

export class Chat {
    constructor(nombreArchivo) {
        this.nombre = nombreArchivo;
        this.rutaDeArchivo = "./public/" + this.nombre + ".txt";
    }


    ///traigo todos los msj del archivo
    async getall() {
        try {
            const archivo = await fs.promises.readFile(this.rutaDeArchivo, 'utf-8');
            const chat = JSON.parse(archivo);
            return chat;
        }
        catch (err) {
            console.log("Error al leer historial de mensajes", err);
        }
    }

    async addMessage(message) {
        try {
            const messages = await this.getall();
            //genero el id para cada msj
            let lastId = 1;
            if (messages.length > 0) {
                lastId = messages[messages.length - 1].id + 1;
            }
            const newMessage = { ...message, id: lastId }
            messages.push(newMessage);
            const newFile=JSON.stringify(messages, null, "\t");
            await fs.promises.writeFile(this.rutaDeArchivo, newFile);

        }
        catch (err) {
            console.log("Error al actualizar historial de mensajes", err);

         }

    }
}