
const randomNumbers=(cant)=>{
    let numbers = [];
    for (let i = 0; i < cant; i++) {
        //calculo cada nro random
        let nm= Math.floor(Math.random() * 1000);
        //verifico si ya esta en el array, sumo al repeat, sino lo agrego
        let index=numbers.findIndex((num) => num.number === nm);
        if(index!= -1){
            numbers[index].repeat= numbers[index].repeat+1;
        }else{
            numbers.push({number: nm, repeat: 1});
        }
           
    }
    return numbers;
}

//envío respuesta al process padre
let numbers=0;
 process.on('message', (msg) => {
    numbers= randomNumbers(msg);
   process.send(numbers);
  })
 