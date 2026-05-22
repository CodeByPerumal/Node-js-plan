const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const client = new DynamoDBClient({
    region: 'us-east-1'
})

const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const docClient = DynamoDBDocumentClient.from(client);

exports.createUser = async (event) => {
    const body = JSON.parse(event.body);

    const params = {
        TableName : 'tasks',
        Item:{
            id : body.id,
            name : body.name,
            age : body.age,
            email :body.email
        }
    }
    await docClient.send(new PutCommand(params));

    return{
        statusCode :200,
        body : JSON.stringifly({
            message : 'User Created Successfully'
        })
    }
}


// get all users

exports.getUsers = async ()=> {
    const params = {
        TableName = 'tasks'
    }

    const data = await docClient.send(new ScanCommand(params))
    return{
        statusCode : 200,
        body
    }
}

module.exports = client;