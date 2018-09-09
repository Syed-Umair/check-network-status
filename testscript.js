let { isConnected } = require('./is-connected');
setInterval(async ()=>{
    console.log(await isConnected());
},5000);