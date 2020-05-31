import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { Key } from '../types';

const XAWS = AWSXRay.captureAWS(AWS);
const dueDateIndex = process.env.DUE_DATE_INDEX;
const bucketName = process.env.IMAGES_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

export class TodoAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly s3Client = createS3Client(),
        private readonly todosTable = process.env.TODOS_TABLE
    ){}

    async getAllTodoItems(userId: string): Promise<TodoItem[]> {
        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: dueDateIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId':userId
            }
        }).promise();

        const items = result.Items;
        return items as TodoItem[];
    }

    async getSingleTodoItem(tableKey: Key): Promise<TodoItem>{
        const result = await this.docClient.get({
          TableName: this.todosTable,
          Key: {
            userId: tableKey.userId,
            todoId: tableKey.todoId
          }
        })
        .promise();
        return result.Item as TodoItem;
    } 

    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        todoItem.attachmentUrl =  `https://${bucketName}.s3.amazonaws.com/${todoItem.todoId}`;
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise();

        return todoItem;
    }

    async updateTodoItem(todoUpdate: TodoUpdate, tableKey: Key): Promise<void> {
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                userId: tableKey.userId,
                todoId: tableKey.todoId
            },
            ExpressionAttributeNames: {
                "#n": "name"
            },
            UpdateExpression: "set #n=:n, dueDate=:dd, done=:d",
            ExpressionAttributeValues: {
                ":n": todoUpdate.name,
                ":dd": todoUpdate.dueDate,
                ":d": todoUpdate.done 
            }
        }).promise();

    }

    async deleteTodoItem(tableKey: Key): Promise<void> {
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                userId: tableKey.userId,
                todoId: tableKey.todoId,
            },
        }).promise();

    }

    getUploadUrl(todoId: string): string {
        return this.s3Client.getSignedUrl('putObject', {
            Bucket: bucketName,
            Key: todoId,
            Expires: urlExpiration
        });
    }

    async deleteAttachment(todoId: string): Promise<void> {
        await this.s3Client.deleteObject({ 
            Bucket: bucketName, 
            Key: todoId 
        }).promise();
    }
}

function createDynamoDBClient() {
    return new XAWS.DynamoDB.DocumentClient();
}

function createS3Client() {
    return new XAWS.S3({
        signatureVersion: 'v4'
      })
}