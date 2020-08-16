const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGO_URL;


exports.handler = async (event, context) => {
  let film = event.queryStringParameters.film;
  if(!film) {
    return {
      statusCode: 500,
      body:'Missing film id'
    }
  }

  try {

    const client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('eleventy_demo');
    const comments = db.collection('comments');

    const query = { "film": film };
    const commentArray = await comments.find(query).sort({posted:1}).toArray();

    await client.close();
    return {
      statusCode: 200,
      body: JSON.stringify(commentArray)
    };


  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
