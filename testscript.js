let { checkNetworkStatus } = require('./check-network-status');
setInterval(async ()=>{
    console.time("Check");
    console.log(await checkNetworkStatus());
    console.timeEnd("Check");
},5000);