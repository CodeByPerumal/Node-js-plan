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

    // GET SPECIFIC SINGLE CUSTOMER
    if(req.method=="GET" && req.url.startsWith("/customers/")){
        console.log(req.url)
        const id = req.url.split("/")[2];
        const customer = customers.find(c=>c.id === id);
        console.log(id);

        // if customer not found in the Database
        if(!customer){
            res.writeHead(404);
            res.end(JSON.stringify({
                error : "Customer Not Found"
            }));
            return;
        }

        res.writeHead(200);
        res.end(JSON.stringify(customer));
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

        // req.on("methodname", ()=>{})
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

    // PUT Method
    if(req.method == "PUT" && req.url.startsWith("/customers/")){
        const id = req.url.split("/")[2]
        let body = ""

        req.on("data", chunk=>{
            body+= chunk.toString();
        });

        req.on("end", ()=>{
            const updatedCustomer = JSON.parse(body);
            const index = customers.findIndex(c=>c.id == id);
            
            if(index===-1){
                res.writeHead(404);
                res.end(JSON.stringify({
                    error : "Customer Not Found"
                }));
                return;
            }
            
            customers[index] = updatedCustomer;
            res.writeHead(200);

            res.end(JSON.stringify({
                message : "Customer Replaced",
                data : updatedCustomer
            }))
        })
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