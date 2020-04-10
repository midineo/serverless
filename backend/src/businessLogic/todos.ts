import * as uuid from 'uuid'
import { TodoAccess } from '../dataLayer/todoAccess'
import { getUploadUrl } from '../dataLayer/fileStorage'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils'

const todoAccess = new TodoAccess()


export async function getUserTodos(jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken)
    return todoAccess.getUserTodos(userId)
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    jwtToken: string): Promise<TodoItem> {

    const itemId = uuid.v4()
    const userId = parseUserId(jwtToken)

    //TODO: Add attachement
    return await todoAccess.createTodo({
        todoId: itemId,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        createdAt: new Date().toISOString(),
        done: false,
        userId: userId,
        attachmentUrl: null
    })

}

export async function updateTodo(
    jwtToken: string,
    todoId: string,
    updateTodoRequest: UpdateTodoRequest
) {
    const userId = parseUserId(jwtToken)
    await todoAccess.updateTodo(userId, todoId, updateTodoRequest)
}

export async function deleteTodo(
    jwtToken: string,
    todoId: string
) {
    const userId = parseUserId(jwtToken)
    await todoAccess.deleteTodo(userId, todoId)
}

export async function addAttachment(
    jwtToken: string,
    todoId: string
) {
    const userId = parseUserId(jwtToken)
    await todoAccess.addAttachment(userId, todoId)
}

export function getImageUploadUrl(todoId: string) {
    return getUploadUrl(todoId + '.jpg')
}