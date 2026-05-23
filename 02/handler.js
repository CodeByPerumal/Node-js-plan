const client =require('./DynamoDB.js')

exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v4! Your function executed successfully!",
    }),
  };
};

exports.id = async(event)=>{
  return{
    statusCode:200,
    body: JSON.stringify({
      message :'ID is successfully displayed '
    })
  }
}