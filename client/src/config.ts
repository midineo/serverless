// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '6glj6egf6j'
export const apiEndpoint = `https://${apiId}.execute-api.eu-west-3.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-wsvwbu5k.auth0.com',            // Auth0 domain
  clientId: 'bh6dBR44YsEY1gwDzTx9J0R66sUaNlpi',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
