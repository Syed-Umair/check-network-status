let x = require('./is-connected');
setInterval(async ()=>{
    console.log(await x());
},1000);