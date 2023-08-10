export interface Todo {
  id: string;
  name: string;
  done: boolean;
}

export type NewTodo = Omit<Todo, "id">;

export function isNewTodo(item: any): item is NewTodo {
  return Boolean(item?.name) && !item.id;
}
