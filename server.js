import { Message } from "./containers/fileMessageContainer.js";
import express from "express";
import handlebars from "express-handlebars";
import { Server as HTTPServer } from "http";
import { Server as SocketServer } from "socket.io";
import { fakeProducts } from "./utils/addProduct.js";
import { normalizeMessages, authorSchema, messageSchema } from "./utils/normalizr.js";
import { daoMessages, daoProducts } from "./daos/index.js";
const app = express();
const httpServer = new HTTPServer(app);
const io = new SocketServer(httpServer)


//Configuro motor de plantillas
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "index.hbs"
  })
);

//Seteo motor de plantillas y carpeta contenedora
app.set("view engine", "hbs");
app.set("views", "./public/views");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



////Instancio la clase


///GENERO LOS 5 PRODUCTOS MOCKEADOS
async function getFakerProducts() {
  for (let i = 0; i <= 5; i++) {
    let product = fakeProducts();
    console.log(product);
    await daoProducts.save(product);
  }
}


io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");
  ///getFakerProducts();

  try {
    socket.server.emit("RENDER_PRODUCTS", await daoProducts.getAll());
    let chat= await daoMessages.getAll();
    //let normalizedChat= normalizeMessages(chat);
    //console.log(normalizedChat)
    socket.server.emit("RENDER_CHAT",{chat: chat ,schema: messageSchema});

  } catch (err) {
    console.log(err);
  }

  socket.on("ADD_PRODUCT", async (product) => {
    await daoProducts.save(product);
    io.sockets.emit("RENDER_PRODUCTS", await daoProducts.getAll());
  });

  socket.on("ADD_MESSAGE", async (message) => {
    const newMessage = new Message(
      message.author.email,
      message.author.name,
      message.author.lastname,
      message.author.age,
      message.author.alias,
      message.author.avatar,
      message.text);
    await daoMessages.save(newMessage);
    let chat= await daoMessages.getAll();
    socket.server.emit("RENDER_CHAT",{chat: normalizedChat ,schema: messageSchema});
  });

});

const PORT = 8080;
const srv = httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${srv.address().port}`);
});
srv.on("error", (error) => console.log(`Error en el servidor: ${error}`));
