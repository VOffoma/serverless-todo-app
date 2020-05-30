import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem';
import { TodoAccess } from '../dataLayer/todosAccess';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { Key } from '../types';

const todoAccess = new TodoAccess();


export async function getAllTodoItems(userId: string): Promise<TodoItem[]> {
    return todoAccess.getAllTodoItems(userId);
}

export async function createTodoItem(createTodoRequest: CreateTodoRequest, userId: string)
: Promise<TodoItem> {
    const itemId = uuid.v4();
    return await todoAccess.createTodoItem({
        todoId: itemId,
        userId: userId,
        createdAt: new Date().toISOString(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false,
    });
}
export async function getSingleTodoItem(todoId: string): Promise<TodoItem> {
    return todoAccess.getSingleTodoItem(todoId);
}

export async function updateTodoItem(updateTodoRequest: UpdateTodoRequest, tableKey: Key): Promise<void> {
    await todoAccess.updateTodoItem({...updateTodoRequest}, tableKey);
}

export async function deleteTodoItem(tableKey: Key): Promise<void> {
    await todoAccess.deleteTodoItem(tableKey);
    // await todoAccess.deleteAttachment(tableKey.todoId);
}

export function getUploadUrl(todoId: string): string {
    return  todoAccess.getUploadUrl(todoId);
}



