import { Todo } from "../models/todo.ts";
import prisma from "../prisma.ts";

export default function listAllTodos() {
  return prisma.todo.findMany();
}
