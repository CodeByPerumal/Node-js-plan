const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({
    region: 'us-east-1'
});

const {
    DynamoDBDocumentClient,
    PutCommand,
    GetCommand,
    DeleteCommand,
    ScanCommand,
    UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");
const { id } = require('./handler');

const docClient = DynamoDBDocumentClient.from(client);


// CREATE USER

exports.createUser = async (event) => {

    try {

        const body = JSON.parse(event.body);

        // VALIDATION

        if (!body.id) {

            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'ID is required'
                })
            };

        }

        // CHECK USER EXISTS
        const getParams = {
            TableName: 'tasks',
            Key:{
                id: body.id
            }
        }

        const existingUser = await docClient.send(new GetCommand(getParams))
        
        //if user already exists
        if(existingUser.Item){
            return{
                statusCode : 400,
                body:JSON.stringify({
                    message:'user Already Created'
                })
            }
        }

       // Check User 
        const params = {
            TableName: 'tasks',
            Item: {
                id: body.id,
                name: body.name,
                age: body.age,
                email: body.email
            }
        };

        await docClient.send(new PutCommand(params));

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'User Created Successfully'
            })
        };

    } catch (error) {

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error Creating User',
                error: error.message
            })
        };

    }
};


// GET ALL USERS

exports.getUsers = async () => {

    try {

        const params = {
            TableName: 'tasks'
        };

        const data = await docClient.send(new ScanCommand(params));

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'All Users Display Successfully',
                users: data.Items
            })
        };

    } catch (error) {

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error Fetching Users',
                error: error.message
            })
        };

    }
};  

exports.updateUser = async (event) => {

    try {

        const body = JSON.parse(event.body);

        // CHECK ID

        if (!body.id) {

            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'ID is required'
                })
            };

        }

        // CHECK USER EXISTS

        const getParams = {
            TableName: 'tasks',
            Key: {
                id: body.id
            }
        };

        const existingUser = await docClient.send(
            new GetCommand(getParams)
        );

        if (!existingUser.Item) {

            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'User Not Found'
                })
            };

        }

        // UPDATE USER

        const params = {
            TableName: 'tasks',
            Key: {
                id: body.id
            },

            UpdateExpression:
                'set #name = :name, age = :age, email = :email',

            ExpressionAttributeNames: {
                '#name': 'name'
            },

            ExpressionAttributeValues: {
                ':name': body.name,
                ':age': body.age,
                ':email': body.email
            },

            ReturnValues: 'ALL_NEW'
        };

        const updatedUser = await docClient.send(
            new UpdateCommand(params)
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'User Updated Successfully',
                user: updatedUser.Attributes
            })
        };

    } catch (error) {

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error Updating Users',
                error: error.message
            })
        };

    }
}

// getUserbyID

exports.getUserById = async (event) => {

    try {

        // GET ID

        const id = event.pathParameters?.id;

        if (!id) {

            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'ID is required'
                })
            };

        }

        // GET USER

        const params = {
            TableName: 'tasks',
            Key: {
                id: id
            }
        };

        const data = await docClient.send(
            new GetCommand(params)
        );

        // USER NOT FOUND

        if (!data.Item) {

            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'User Not Found'
                })
            };

        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'User Found Successfully',
                user: data.Item
            })
        };

    } catch (error) {

        console.log(error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error Fetching User',
                error: error.message
            })
        };

    }
};

exports.deleteById = async (event) => {

    try {

        // GET ID

        const id = event.pathParameters?.id;

        // CHECK ID

        if (!id) {

            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'ID is required'
                })
            };

        }

        // CHECK USER EXISTS

        const getParams = {
            TableName: 'tasks',
            Key: {
                id: id
            }
        };

        const existingUser = await docClient.send(
            new GetCommand(getParams)
        );

        // USER NOT FOUND

        if (!existingUser.Item) {

            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'User Not Found'
                })
            };

        }

        // DELETE USER

        const params = {
            TableName: 'tasks',
            Key: {
                id: id
            }
        };

        await docClient.send(
            new DeleteCommand(params)
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'User Deleted Successfully'
            })
        };

    } catch (error) {

        console.log(error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error Deleting User',
                error: error.message
            })
        };

    }
};

