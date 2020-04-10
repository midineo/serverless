const AWS = require('aws-sdk');
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
const bucketName = process.env.TODOS_S3_BUCKET

export class TodoAccess {

    constructor(
        private readonly docClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODOS_TABLE) { }

    async getUserTodos(userId: string): Promise<TodoItem[]> {

        const result = await this.docClient.query({
            TableName: this.todoTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false
        }).promise()

        const items = result.Items
        return items
    }

    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todoTable,
            Item: todoItem
        }).promise()
        return todoItem
    }

    async updateTodo(userId: string, todoId: string, todoUpdate: TodoUpdate) {

        await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                'userId': userId,
                'todoId': todoId
            },
            UpdateExpression: 'set #nm = :n, dueDate = :t,done= :d',
            ExpressionAttributeNames: {
                "#nm": "name"
            },
            ExpressionAttributeValues: {
                ':n': todoUpdate.name,
                ':t': todoUpdate.dueDate,
                ':d': todoUpdate.done
            }
        }).promise()

    }

    async deleteTodo(userId: string, todoId: string) {

        await this.docClient.delete({
            TableName: this.todoTable,
            Key: {
                'userId': userId,
                'todoId': todoId
            }
        }).promise()
    }

    async addAttachment(userId: string, todoId: string) {

        const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}.jpg`

        await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                'userId': userId,
                'todoId': todoId
            },
            UpdateExpression: 'set attachmentUrl = :a',
            ExpressionAttributeValues: {
                ':a': attachmentUrl,
            }
        }).promise()
    }
}