let { checkNetworkStatus } = require('./check-network-status');
setInterval(async ()=>{
    console.time("Check");
    console.log(await checkNetworkStatus({timeout: 2000}));
    console.timeEnd("Check");
},5000);
