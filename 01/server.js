// Build A Small HTTP Server
const http = require('http');

// dummy Database
let customers = [
    {
        id : "f1fdafcb-94dd-4310-b3a3-d4cb3b6f49d4",
        fullName : "Perumal V",
        city : "Chennai"
    }
]

const server = http.createServer((req,res)=>{
    res.setHeader("Content-Type", "application/json");

    if(req.method=="GET" && req.url == "/customers"){
        res.writeHead(200, {"Content-Type" : "application/json"});
        let str = JSON.stringify(customers)
        console.log(str)
        res.end(JSON.stringify(customers));
        return;
    }

    // POST NEW CUSTOMER
    if (req.method=="POST" && req.url == "/customers"){
        let body = ""
        req.on("data", chunk=>{
            console.log("RAW CHUNK:");
            console.log(chunk.toString())

            body+=chunk.toString()
            console.log(typeof body)
        });

        req.on("end", ()=>{
            console.log("FINAL BODY");
            console.log(body);

            const newCustomer = JSON.parse(body)

            console.log("PARSED OBJECT")
            console.log(newCustomer)

            customers.push(newCustomer)
            
            console.log("UPDATED DATABASE")
            console.log(customers)

            res.writeHead(201);

            res.end(JSON.stringify({
                message:"Customer created",
                data : newCustomer
            }));

        });
        return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({error: "File Not Found"}))
})

server.listen(3000, ()=>{
    console.log(`server is running on 3000`)
})

// Test on postman
// http://localhost:3000/customers
/*
output: 
[
    {
        "id": "CUST-1",
        "fullName": "Perumal V"
    }
]
*/