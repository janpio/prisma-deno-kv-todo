import { Todo, NewTodo } from "../models/todo.ts";
import prisma from "../prisma.ts";

export default function createTodo(todo: NewTodo) {
  return prisma.todo.create({ data: todo });
}
