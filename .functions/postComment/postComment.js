const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGO_URL;

exports.handler = async (event, context) => {

  const {identity, user} = context.clientContext;

  if(!user) {
    return {
      statusCode: 500,
      body:'Unauthenticated call to function.'
    }
  };

  console.log(JSON.stringify(user));

  const comment = JSON.parse(event.body);
  console.log('COMMENT', comment);

  try {

	  const client = new MongoClient(url, { useUnifiedTopology: true });
  	await client.connect();
  	const db = client.db('eleventy_demo');
  	const comments = db.collection('comments');

    let commentOb = {
      text: comment.text, 
      film: comment.film, 
      user: {
        email: user.email, 
        name: user.user_metadata.full_name
      },
      posted: new Date()
    }

    let r = await comments.insertOne(commentOb);
    await client.close();

    return {
      statusCode: 204
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
