import 'source-map-support/register'
import { createLogger } from '../../utils/logger';
import { createTodoItem } from '../../businessLogic/todos';
import { getUserId } from '../utils';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
const logger = createLogger('create-todo');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  logger.info('Processing event for create todoitem with the following detail: ', newTodo);
  // TODO: Implement creating a new TODO item
  const userId = getUserId(event);

  const item = await createTodoItem(newTodo, userId);

  logger.info('detail for new todoItem: ', item);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item
    })
  }
}
