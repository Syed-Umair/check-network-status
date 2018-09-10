let { checkNetworkStatus } = require('./check-network-status');
setInterval(async ()=>{
    console.log(await checkNetworkStatus());
},5000);