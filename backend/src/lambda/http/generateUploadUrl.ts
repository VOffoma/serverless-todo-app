import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { getUploadUrl, getSingleTodoItem } from '../../businessLogic/todos';
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('generate-upload-url');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  logger.info('Processing event to create upload url for todoitem with id: ', todoId);
  
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  try {
    const userId = getUserId(event);

    const todoItem = await getSingleTodoItem(todoId);
  
    if(!todoItem) {
        throw new Error('this todoItem does not exist');
    }
  
    if(userId !== todoItem.userId){
        throw new Error('You can not make changes to this todoItem because you did not create it');
    }
  
    const url = getUploadUrl(todoId);
    logger.info('upload url: ', url);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
          uploadUrl: url
      })
    };
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
