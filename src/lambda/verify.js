export function handler(event, context, callback) {

  const key = event.queryStringParameters.key || "";
  console.log("KEY IS:" + key)

  if(key !== process.env.VUE_APP_KEY || process.env.VUE_APP_MAINTEANCE == 'true') {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify("not verified")
    })
  } else {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify("verified")
    })
  }
}

