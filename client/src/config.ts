// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '7mwtaacgol'
export const apiEndpoint = `https://${apiId}.execute-api.eu-west-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-qb2jhova.eu.auth0.com',            // Auth0 domain
  clientId: 'KVk31XUSXvu0Px1ZuVF8yz1J1yTq5QQ6',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
