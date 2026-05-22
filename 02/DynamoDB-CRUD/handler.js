const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  region : "us-east-1"
});

const crypto = require("crypto");

const dynamoDB = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "Customers";

// GET ALL Customers - ScanCommand()
module.exports.getCustomers = async()=>{
    try{
      const command = new ScanCommand({
        TableName: TABLE_NAME
      })

      const response = await dynamoDB.send(command)

      return {
        statusCode : 200,
        body : JSON.stringify(response.Items)
      }
    } 
    catch(err){
      return {
        statusCode : 500,
        body : JSON.stringify({
          error: err.message
        })
      }
    }
}

// CREATE CUSTOMER - PutCommand
module.exports.createCustomer = async(event)=>{
    try{
      // REQUEST BODY
      const body = JSON.parse(event.body);

      // NEW OBJECT
      const customer = {
        id: crypto.randomUUID(),
        fullName : body.fullName,
        city : body.city,
        address: body.address
      };

      // PUT COMMAND
      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: customer
      })

      // SAVE TO DYNAMODB
      await dynamoDB.send(command);

      return {
        statusCode: 201,
        body:JSON.stringify({
          message: "User Created",
          data: customer
        })
      }
    }
    catch(err){
      return {
        statusCode : 500,
        body: JSON.stringify({
          error: err.message
        })
      };
    }
};

exports.health = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Payflow is alive!",
    }),
  };
};