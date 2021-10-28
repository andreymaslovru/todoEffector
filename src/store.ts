import { createEvent, createStore } from "effector";

// Standard interface and functions
export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

const updateTodo = (todos: Todo[], id: number, text: string): Todo[] =>
  todos.map((todo) => ({
    ...todo,
    text: todo.id === id ? text : todo.text,
  }));

const toggleTodo = (todos: Todo[], id: number): Todo[] =>
  todos.map((todo) => ({
    ...todo,
    done: todo.id === id ? !todo.done : todo.done,
  }));

const removeTodo = (todos: Todo[], id: number): Todo[] =>
  todos.filter((todo) => todo.id !== id);

const addTodoToList = (todos: Todo[], text: string): Todo[] => [
  ...todos,
  {
    id: Math.max(0, Math.max(...todos.map(({ id }) => id))) + 1,
    text,
    done: false,
  },
];

// Effectore state init

type Store = {
  todos: Todo[];
  newTodo: string;
};

// event

export const setNewTodo = createEvent<string>();
export const addTodo = createEvent();

// createStore

export default createStore<Store>({
  todos: [],
  newTodo: "",
})
  .on(setNewTodo, (state, newTodo) => ({
    ...state,
    newTodo,
  }))
  .on(addTodo, (state) => ({
    ...state,
    newTodo: "",
    todos: addTodoToList(state.todos, state.newTodo),
  }));
