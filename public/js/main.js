
const socket = io.connect();
let nameLogin="";


socket.on("connect", () => {
    console.log("Conectado al servidor");
});



///Traigo la plantilla para generar el html
const prodTable = async (prod) => {
    const tFile = await fetch("./views/table.hbs");
    const view = await tFile.text();
    const template = Handlebars.compile(view);
    const html = template({ prod: prod })
    return html;
}

const chatList = async (messages) => {
    const lFile = await fetch("./views/chat.hbs");
    const lView = await lFile.text();
    const ltemplate = Handlebars.compile(lView);
    const lhtml = ltemplate({ messages: messages });
    return lhtml;
}



let logSpan = document.querySelector("#logSpan");

socket.on("RENDER_PRODUCTS", (prod, name) => {
    prodTable(prod).then((html) => {
        tableContainer.innerHTML = html;
    });
    nameLogin= name;
    let text= "Bienvenido "+nameLogin
    logSpan.innerHTML= text;
    
})

socket.on("RENDER_CHAT", (chat) => {
    ///const deNormalized= normalizr.denormalize(chat.result, [schema] , chat.entities);
    chatList(chat).then((lhtml) => {
        messageListContainer.innerHTML = lhtml;
    });
})

const productsForm = document.querySelector('#productsForm');
productsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const titleInput = document.querySelector('#titleInput')
    const priceInput = document.querySelector('#priceInput');
    const thumbnailInput = document.querySelector('#thumbnailInput');
    const newProd = {
        title: titleInput.value,
        price: priceInput.value,
        thumbnail: thumbnailInput.value
    }
    socket.emit("ADD_PRODUCT", newProd);
    titleInput.value = "";
    priceInput.value = "";
    thumbnailInput.value = "";
})

const btnSend = document.querySelector('#btnEnviarMsj');
btnSend.addEventListener('click', (e) => {
    e.preventDefault();
    const emailInput = document.querySelector("#emailInput");
    const nameInput = document.querySelector("#nameInput");
    const lastNameInput = document.querySelector("#lastNameInput");
    const ageInput = document.querySelector("#ageInput");
    const aliasInput = document.querySelector("#aliasInput");
    const avatarInput = document.querySelector("#avatarInput");
    const textMsgInput = document.querySelector("#textMsgInput");
    const newMsg = {
        author: {
            email: emailInput.value,
            name: nameInput.value,
            lastname: lastNameInput.value,
            age: ageInput.value,
            alias: aliasInput.value,
            avatar: avatarInput.value
        },
        text: textMsgInput.value,
    }
    
    socket.emit("ADD_MESSAGE", newMsg);
    emailInput.value = "";
    textMsgInput.value = "";

});

const emailInput = document.querySelector("#emailInput");
emailInput.addEventListener('change', (e) => {
    if (emailInput.value !== "") {
        btnSend.disabled = false;
    } else {
        btnSend.disabled = true;
    }

});

function delayRedirect(){
    var count = 2;
    setInterval(function(){
        count--;
        if (count == 0) {
            window.location = 'http://localhost:8080/'; 
        }
    },1000);
}

const btnLogout = document.querySelector("#btnLogout");
const divLogout = document.querySelector("#divLogout");
btnLogout.addEventListener('click', (e) => {
    let text= "Hasta luego "+nameLogin;
    logSpan.innerHTML= text;
    delayRedirect()
});









