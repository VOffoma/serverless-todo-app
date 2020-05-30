import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodoItem, getSingleTodoItem } from '../../businessLogic/todos';
import { Key } from '../../types';
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('update-todo');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  logger.info('Processing event to update todoitem with id: ', todoId);
  logger.info('update content:  ', updatedTodo);

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    try {
        const userId = getUserId(event);
        const todoItemForUpdate = await getSingleTodoItem(todoId);

        if(!todoItemForUpdate) {
            throw new Error('this todoItem does not exist');
        }

        if(userId !== todoItemForUpdate.userId){
            throw new Error('You can not make changes to this todoItem because you did not create it');
        }

        const tableKey: Key = {todoId, createdAt: todoItemForUpdate.createdAt}
        await updateTodoItem(updatedTodo, tableKey);

        logger.info('todoitem has been updated');

        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          },
          body: JSON.stringify({})
        }
    } catch (error) {
        logger.info(error.message);
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: error.message
            })
        }
    }
  
}



// export async function userOwnsTodoItem(todoId: string, jwtToken: string): Promise<boolean> {
//     const result = await todoAccess.getSingleTodoItem(todoId);
//     const userId = parseUserId(jwtToken);
//     return userId === result.Item ? true : false;
// }
