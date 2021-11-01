import {
  createEvent,
  createStore,
  createEffect,
  combine,
  restore,
} from "effector";
import { configure } from "effector-logger";

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

// events

export const setNewTodo = createEvent<string>();
export const addTodo = createEvent();
export const update = createEvent<{ id: number; text: string }>();
export const remove = createEvent<number>();
export const toggle = createEvent<number>();

configure(addTodo, { log: "disabled" });

// effects

export const getTodosFx = createEffect(async (url: string) => {
  const res = await fetch(url);
  return res.json();
});

// createStore

export default createStore<Store>({
  todos: [],
  newTodo: "",
})
  .on(getTodosFx.doneData, (state, todos) => ({
    ...state,
    todos,
  }))
  .on(setNewTodo, (state, newTodo) => ({
    ...state,
    newTodo,
  }))
  .on(addTodo, (state) => ({
    ...state,
    newTodo: "",
    todos: addTodoToList(state.todos, state.newTodo),
  }))
  .on(update, (state, { id, text }) => ({
    ...state,
    newTodo: "",
    todos: updateTodo(state.todos, id, text),
  }))
  .on(toggle, (state, id) => ({
    ...state,
    newTodo: "",
    todos: toggleTodo(state.todos, id),
  }))
  .on(remove, (state, id) => ({
    ...state,
    newTodo: "",
    todos: removeTodo(state.todos, id),
  }));

export const $fetchError = restore<Error>(getTodosFx.failData, null);

export const $todosGetStatus = combine({
  loading: getTodosFx.pending,
  error: $fetchError,
});
