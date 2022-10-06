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
import { authMiddleware } from "./utils/middlewares.js";
import { Types } from 'mongoose';
import { isValidPassword, createHash } from "./utils/utils.js"
import { User} from "./utils/database.js"
import passport from "passport";
import { Strategy } from "passport-local";
import {routeInfo, routeRandom} from "./routesApi.js"

import parseArgs from "minimist";

const options={default: {PORT: 8080}, alias:{p: "PORT"}}
const args= parseArgs(process.argv.slice(2), options);

const LocalStrategy = Strategy;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

 
const app = express();
const httpServer = new HTTPServer(app);
const io = new SocketServer(httpServer)
export let logUsr = "";


/////PASSPORT

passport.use("login", new LocalStrategy(async (username, password, done) => {
  const user = await User.findOne({ username });
  let passHash = user.password;
  if (!user || !isValidPassword(password, passHash)) {
    return done(null, null, { message: "Invalid username or password" });
  } else {
    return done(null, user);
  }

}));

passport.use("signup", new LocalStrategy({
  passReqToCallback: true
}, async (req, username, password, done) => {
  const user = await User.findOne({ username });
  if (user) {
    return done(null, null);
  }

  const hashedPassword = createHash(password);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  id = Types.ObjectId(id);
  const user = await User.findById(id);
  done(null, user);
});

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
  store: new MongoStore({
    mongoUrl: 'mongodb+srv://root:pwd123@cluster0.age0did.mongodb.net/?retryWrites=true&w=majority',
    dbName: "ecommerce-db",
    collectionName: "sessions",
    ttl: 600,//Seteo el tiempo de sesión en 10min
    retries: 0
  }),
  secret: 'STRING_SECRET',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/info',routeInfo);
app.use('/api', routeRandom);


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


app.get('/', (req, res, next) => {
  res.redirect("/dashboard");
});

app.post("/signup", passport.authenticate("signup", {
  failureRedirect: "/failSignup",
}), (req, res) => {
  req.session.user = req.user;
  logUsr = req.session.user.username;
  res.redirect("/dashboard");
});

app.post('/login', passport.authenticate("login", {
  failureRedirect: "/failLogin",
}), (req, res) => {
  req.session.user = req.user;
  logUsr = req.session.user.username;
  res.redirect("/dashboard");
});

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  //Si esta autenticado va a directo a dashboard
  if (!req.session.user) {
    res.sendFile(__dirname + "/public/login.html");
  } else {
    res.redirect("/dashboard");
  }

})

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/public/signup.html");
});

app.get("/dashboard", authMiddleware, (req, res) => {
  //refresco la sesión cada vez que entro al dashboard
  let refreshName = req.session.name;
  req.session.name = refreshName;
  res.sendFile(path.resolve(__dirname, './public/dashboard.html'));
});

app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.send("Error al cerrar sesion");
    }
    res.redirect("/login")
  });
});

app.get("/failLogin", (req, res) => {
  res.sendFile(__dirname + "/public/failLogin.html");
})

app.get("/failSignup", (req, res) => {
  res.sendFile(__dirname + "/public/failSignup.html");
})



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
    socket.server.emit("RENDER_PRODUCTS", await daoProducts.getAll(), logUsr);
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

console.log("ARGGG", args)
const PORT = args.PORT;
const srv = httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${srv.address().port}`);
});
srv.on("error", (error) => console.log(`Error en el servidor: ${error}`));
