import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
//import Axios from 'axios'
//import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
//const jwksUrl = '...'

const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJO/qW90xL6xwuMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi13c3Z3YnU1ay5hdXRoMC5jb20wHhcNMjAwNDA1MTk1NzU3WhcNMzMx
MjEzMTk1NzU3WjAhMR8wHQYDVQQDExZkZXYtd3N2d2J1NWsuYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvrDulR9OWmNksvG+hjsxXlH8
8RNlXZvKhtdEll5uIwYHGZBA6B1HdMnb5ilj5Q9bxzZ9swwYHDDgdHc7sPsW8DM6
LmvziSWBfHs6e+kUFz8wcvJbrJGHqPVoSwJWpO6MGKx6w4pLBunAiLXUB4asTT0O
DEUnnTDAKfcsuva+4DxFed8kvLoaec3r3ZJyjF90/sTkIzas2g6lPtKd668fYlvm
C22lPl8nj42ahLr3zYGfbluezGNAfe2usAfzCbdYhZgb61wE84+IK8wPg5xpAi+h
raQjeyrd7XYbEUZ/5fu5EeEKXPv3VqP52pl47hd8wxLp/6Y1/RxenK77pRBOpQID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTUoQ/8UmDTnSHC3nWH
3SbDYhrP9jAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAA1tQaNk
VUjOkVVYxj4OgzhQLyY2ty6ALwU0a81LmnwlM9mEqrPzc1DaodUanb9+cLBGSh3z
nbHLesm1/IU8yUbXqbnJdCMOltJyy611J88Uh6jpJ1+e5bzXKE4UJWF6gksYOVwi
bWWdS1eHA6YAZudjCRHnRNBOaQnO6c4NtRlFT5BpkGkUd7iKWfAWYaR0zngeMEW/
GpjNTbs0k6j6E35IjaxiLhWbRo4wVrPrldVdbY6foPzwtsODHlIPGDUmeWE9J6+K
QPPxChE9syO8pJ2hpmvrdD6xAAcY0CP4YlCfzXlRt/xGj+dLCzKQkP/OBHBxsdpA
pcTkg30m7sK6I4E=
-----END CERTIFICATE-----`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {

  logger.info('Authorizing a user', event.authorizationToken)

  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  //const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
