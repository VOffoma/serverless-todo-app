import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { createLogger } from '../../utils/logger';

import { deleteTodoItem, getSingleTodoItem } from '../../businessLogic/todos';
import { Key } from '../../types';
import { getUserId } from '../utils';

const logger = createLogger('delete-todo');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;

  logger.info('Processing event to delete todoitem with id: ', todoId);
  // TODO: Remove a TODO item by id

  try {
    const userId = getUserId(event);
    const tableKey: Key = {userId, todoId}
    const todoItemForDelete = await getSingleTodoItem(tableKey);

    if(!todoItemForDelete) {
        throw new Error('this todoItem does not exist');
    }

    if(userId !== todoItemForDelete.userId){
        throw new Error('You can not make changes to this todoItem because you did not create it');
    }

    
    await deleteTodoItem(tableKey);

    logger.info('todoitem has been deleted. TodoItem: ', todoId);

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
