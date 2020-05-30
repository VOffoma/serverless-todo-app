import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';

import { getAllTodoItems } from '../../businessLogic/todos';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';


const logger = createLogger('get-all-todos');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
    const userId = getUserId(event);

    logger.info('Processing event for getting all todoitems for user ', userId);
    
    const items = await getAllTodoItems(userId);

    logger.info('todoItems for user: ', items);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        items
      })
    }
}
