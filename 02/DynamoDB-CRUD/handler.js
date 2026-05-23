const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand
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

      console.log(command)

      const response = await dynamoDB.send(command)

      console.log(response.Items)
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

      console.log(customer);

      // PUT COMMAND
      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: customer
      })

      console.log(command)

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

// GET CUSTOMER BY ID - GetCommand
module.exports.getCustomerById = async(event)=>{
    try{
      const id = event.pathParameters.id;

      const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          id: id
        }
      });

      const response = await dynamoDB.send(command);

      if (!response.Item) {
        return {
          statusCode: 404,
          body: JSON.stringify({
            message: "Customer Not Found"
          })
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(response.Item)
      };
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

// UPDATE CUSTOMER - PUT (REPLACE/UPDATE - FULL RESOURCE)
module.exports.updateCustomer = async(event)=>{
    try{
      // CUSTOMER ID FROM URL
      const id = event.pathParameters.id

      // REQUEST BODY
      const body = JSON.parse(event.body);

      // UPDATE COMMAND
      const command = new UpdateCommand({
        TableName : TABLE_NAME,

        Key: {
          id: id
        },

        UpdateExpression:
          "set fullName= :fullName, city= :city, address= :address",

        ExpressionAttributeValues: {
          ":fullName": body.fullName,
          ":city": body.city,
          ":address": body.address
        },

        ReturnValues: "ALL_NEW"

      });

      // EXECUTE UPDATE
      const response = await dynamoDB.send(command);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Customer Updated",
          data : response.Attributes
        })
      };
    }

    catch(err){
        return {
          statusCode : 500,
          body : JSON.stringify({
            error : err.message
          })
        }
    }
}

// SPECIFIC UPDATE - PATCH
module.exports.patchCustomer = async(event)=>{
    try{
      const id = event.pathParameters.id;
      const body = JSON.parse(event.body);
      const fields = Object.keys(body);

      if (fields.length === 0) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: "Request body must contain at least one field"
          })
        };
      }

      let updateExpression = "set ";
      let expressionAttributeNames = {};
      let expressionAttributeValues = {};

      // DYNAMIC PATH
      fields.forEach((key, index)=>{
        updateExpression += `#${key} = :${key}`;

        if(index < fields.length - 1){
          updateExpression += ", ";
        }

        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = body[key];
      });
      
      // console.log(expressionAttributeValues);
      const command = new UpdateCommand({
          TableName: TABLE_NAME,
          Key: {
            id: id
          },

          UpdateExpression: updateExpression,
          ExpressionAttributeNames:
              expressionAttributeNames,
          ExpressionAttributeValues: 
              expressionAttributeValues,
          ReturnValues: "ALL_NEW"
      });

      const response = await dynamoDB.send(command);
      return {
        statusCode : 200,
        body: JSON.stringify({
          message: "Customer Patched",
          data: response.Attributes
        })
      };

    }
    catch(err){
      return {
        statusCode : 500,
        body: JSON.stringify({
          error: err.message
        })
      }
    }
}

// DELETE CUSTOMER - DeleteCommand
module.exports.deleteCustomer = async(event)=>{
    try{
      const id = event.pathParameters.id;
      console.log(id)

      const command = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
          id: id
        },
        ReturnValues: "ALL_OLD"
      });

      const response = await dynamoDB.send(command);

      if (!response.Attributes) {
        return {
          statusCode: 404,
          body: JSON.stringify({
            message: "Customer Not Found"
          })
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Customer Deleted",
          data: response.Attributes
        })
      };
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
