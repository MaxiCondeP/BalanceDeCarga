import { Message } from "./containers/fileMessageContainer.js";
import express from "express";
import handlebars from "express-handlebars";
import { Server as HTTPServer } from "http";
import { Server as SocketServer } from "socket.io";
import { fakeProducts } from "./utils/addProduct.js";
import { daoMessages, daoProducts } from "./daos/index.js";
import session from 'express-session';
import MongoStore from "connect-mongo";
import path from "path";
import { fileURLToPath } from 'url';
import { isLogged } from "./utils/middlewares.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();
const httpServer = new HTTPServer(app);
const io = new SocketServer(httpServer)
export let nameGlobal= "";


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

app.use(session({
  store: new MongoStore({
    mongoUrl: 'mongodb+srv://root:pwd123@cluster0.age0did.mongodb.net/?retryWrites=true&w=majority',
    dbName: "ecommerce-db",
    collectionName: "sessions",
    ttl: 60,
    retries: 0
  }),
  secret: 'STRING_SECRET',
  resave: false,
  saveUninitialized: true,
}));



app.use((req, res, next) => {
  isLogged(req, res, next);
});

app.post('/', (req, res, next) => {
  const name = req.body.name;

  if (name) {
    req.session.name = name;
    nameGlobal=name;
    res.status=200;
    res.sendFile(path.resolve(__dirname, './public/dashboard.html'));
  }
});


app.get('/', (req, res, next) => {
  if (res.statusCode !== 401) {
    //renuevo la sesión
    let refreshName= req.session.name;
    req.session.name=refreshName;
    res.sendFile(path.resolve(__dirname, './public/dashboard.html'));
  } else {
    res.sendFile(path.resolve(__dirname, './public/login.html'));
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if(err) {
      res.send("Error al cerrar sesion");
    }
  });
});

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
    socket.server.emit("RENDER_PRODUCTS", await daoProducts.getAll(), nameGlobal);
    let chat = await daoMessages.getAll();
    socket.server.emit("RENDER_CHAT", chat);

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
    let chat = await daoMessages.getAll();
    socket.server.emit("RENDER_CHAT", chat);
  });

});

const PORT = 8080;
const srv = httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${srv.address().port}`);
});
srv.on("error", (error) => console.log(`Error en el servidor: ${error}`));
