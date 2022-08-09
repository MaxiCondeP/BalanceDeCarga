


///Creo la clase Producto
export class Product {
    constructor(name, price, thumb) {
        this.title = name;
        this.price = price;
        this.thumbnail = thumb;
    }
}
///creo la clase Contenedor

export class Contenedor {
    constructor() {
        this.products = []
    }

    ///Traigo el archivo y devuelvo el array.
    getAll() {

        return this.products;

    }


    ////Agrego producto al array
    save(product) {
        //Defino el valor del id en base al contenido del array
        let lastId = 1;
        if (this.products.length > 0) {
            lastId = this.products[this.products.length - 1].id + 1;
        }
        console.log(product)
        let newProduct = { ...product, id: lastId };
        //agrego el producto al array
        this.products.push(newProduct);
        //muestro el último id
        console.log(`El último id es: ${lastId}`);
        return lastId;
    }

    ////Devuelvo un  producto por el ID
    getByID(id) {
        //Filtro el array por ID
        const prod = this.products.find(prod => prod.id == id);
        if (prod) {
            //Muestro y devuelvo el producto
            console.log(prod);
            return prod;
        } else {
            console.log("No se encontró el producto.")
            return null;
        }
    }


    ///Elimino un producto por ID
    deleteById(id) {
        //Busco el index del id, y si existe lo elimino del array
        const index = this.products.findIndex(prod => prod.id == id);
        if (index != -1) {
            this.products.splice(index, 1);
        } else {
            console.log("No se encontró el producto");
        }
    }

    ////Elimino todos los elementos del array
    deleteAll() {
        this.products = [];
    }


    editById(id, product) {
        //Valido si existe el id, en ese caso lo modifico
        const index = this.products.findIndex(prod => prod.id == id);
        if (index != -1) {
            this.products[index].title = product.title;
            this.products[index].price = product.price;
            this.products[index].thumbnail = product.thumbnail;
        } else {
            console.log("No se encontró el producto");
        }
    }




}


