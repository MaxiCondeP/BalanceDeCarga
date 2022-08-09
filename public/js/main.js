const socket= io.connect();

socket.on("connect",()=>{
    console.log("Conectado al servidor");
});



///Traigo la plantilla para generar el html
const prodTable= async(prod)=>{
    const tFile= await fetch("./views/table.hbs");
    const view= await tFile.text();
    const template= Handlebars.compile(view);
    const html= template({prod: prod})
    return html; 
}

const chatList= async(messages)=>{
    const lFile= await fetch("./views/chat.hbs");
    const lView= await lFile.text();
    const ltemplate= Handlebars.compile(lView);
    const lhtml= ltemplate({messages: messages});
    return lhtml;
}

socket.on("RENDER_PRODUCTS", (prod)=>{
    prodTable(prod).then((html)=>{
        tableContainer.innerHTML= html;
    });
})

socket.on("RENDER_CHAT", (messages)=>{
    chatList(messages).then((lhtml)=>{
        messageListContainer.innerHTML= lhtml; 
    });

})

const productsForm= document.querySelector('#productsForm');
productsForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const titleInput= document.querySelector('#titleInput')
    const priceInput= document.querySelector('#priceInput');
    const thumbnailInput= document.querySelector('#thumbnailInput');
    const newProd={
        title: titleInput.value,
        price: priceInput.value, 
        thumbnail: thumbnailInput.value
    }
    socket.emit("ADD_PRODUCT" ,newProd); 
    titleInput.value="";
    priceInput.value="";
    thumbnailInput.value="";
})

const btnSend= document.querySelector('#btnEnviarMsj');
btnSend.addEventListener('click',(e)=>{
    e.preventDefault();
    const emailInput= document.querySelector("#emailInput");
    const textMsgInput= document.querySelector("#textMsgInput");
    const newMsg={
        text: textMsgInput.value, 
        email: emailInput.value
    }
    socket.emit("ADD_MESSAGE" ,newMsg); 
    emailInput.value="";
    textMsgInput.value="";
    
});

const emailInput= document.querySelector("#emailInput");
emailInput.addEventListener('change',(e)=>{
    if(emailInput.value!==""){
        btnSend.disabled=false;
    }else{
        btnSend.disabled=true; 
    }
    
});


