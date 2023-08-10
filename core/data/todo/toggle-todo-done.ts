import { Todo } from "../models/todo.ts";
import prisma from "../prisma.ts";
import getTodo from "./get-todo.ts";

export default async function toggleTodoDone(todoId: string) {
  const todoDoc = await getTodo(todoId);

  if (!todoDoc) {
    throw new Error(`Record with id ${todoId} was not found.`);
  }

  return await prisma.todo.update({ 
    where: {
      id: todoId
    },
    data: {
      done: !todoDoc.done
    }
  });
}
