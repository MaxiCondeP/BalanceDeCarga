import {config} from '../config.js';

///creo la clase Contenedor

export class firebaseProductContainer {
    constructor() {
        this.db = config.firebase.db;
		this.query = this.db.collection('products');
    }

    ///Traigo el archivo y devuelvo el array.
    async getAll() {
        try {
            const querySnapshot = await this.query.get();
			let docs = querySnapshot.docs;
			const content = docs.map((doc) => (doc.data()));
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
            let newProduct = { ...product, id: lastId };
            //agrego el producto a la bd
            let doc = this.query.doc(`${lastId}`);
            await doc.create(newProduct);
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
            const doc=   this.query.doc(`${id}`);
            const element= await doc.get();
            return element.data();
           
        } catch (err) {
            console.log("No se encontró el product", err)
            return { error: "No se encontró el product" }
        }
    }

}

