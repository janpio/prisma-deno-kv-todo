import { Todo } from "../models/todo.ts";
import prisma from "../prisma.ts";

export default function getTodo(id: string) {
  return prisma.todo.findUnique({ where: { id: id }})
}
