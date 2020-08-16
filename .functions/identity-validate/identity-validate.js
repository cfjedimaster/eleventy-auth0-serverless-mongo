// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (event, context) => {
  console.log('identity-validate!');
  console.log(event.body);
  let data = JSON.parse(event.body);
  
  let user = data.user;
  if(!user) {
    console.log('no user??');
    return {
      statusCode: 500
    }
  }

  let me = {
    email:user.email, 
    name:user.user_metadata.full_name
  }
  console.log('me', JSON.stringify(me));

  /*

	user.findOne({email:me.email}, function(err, u) {
		if(!u) {
			me.save(function(err, me) {
				if(err) return done(err);
				done(null,me);
			});
		} else {
			//console.log(u);
			done(null, u);
		}
	});
  */

  try {
    return {
      statusCode: 200,
      body: JSON.stringify(me),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
