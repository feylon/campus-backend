import Express from "express";
import http from "http";

const app = Express();


const server = http.createServer(app);
app.use("/", function (req, res) {res.send("salo,")})


server.listen(4100, function(){
    console.log("salom")
});