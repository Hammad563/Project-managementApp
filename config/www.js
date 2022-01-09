/**
 * Module dependencies.
 */
const app = require('../app');
const http = require('http');
const debug = require("debug")("tasknow:server");


// set port
const port = process.env.PORT
app.set("port", port);

// create http server
const server = http.createServer(app);
// listening event
 server.listen(port);
server.on("error",onError);
server.on("listening", listening);


//error function
function onError(error){
    if(error.syscall !== "listen"){
        throw error;
    }
}

// listening function

function listening() {
    const address = server.address();
    const bind = typeof address === "string" ? "pipe" + address : "port" + address.port;
    debug("listening on" + port);
}



