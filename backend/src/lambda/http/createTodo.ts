import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../businessLogic/todos'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log('Create Todo Processing event: ', event);
  const createTodoRequest: CreateTodoRequest = JSON.parse(event.body);
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const newItem = await createTodo(createTodoRequest, jwtToken)

  return {
    statusCode: 200,
    body: JSON.stringify({
      item: newItem
    }),
  };

})

handler.use(cors({
  credentials: true
}))