import * as React from "react";
import { Button, Input, Flex, Checkbox, Heading } from "@chakra-ui/react";
import { useStore } from "effector-react";

import $store, { toggle, remove, update, $todosGetStatus } from "../store";

function TodoListItems() {
  const store = useStore($store);
  const { loading, error } = useStore($todosGetStatus);
  return (
    <>
      {!!loading || error ? (
        <div>"IsLoading..."</div>
      ) : (
        store.todos.map((todo) => (
          <Flex pt={2} key={todo.id}>
            <Checkbox checked={todo.done} onClick={() => toggle(todo.id)} />
            <Input
              mx={2}
              value={todo.text}
              onChange={(evt) =>
                update({ id: todo.id, text: evt.target.value })
              }
            />
            <Button onClick={() => remove(todo.id)}>Delete</Button>
          </Flex>
        ))
      )}
    </>
  );
}

function TodoList() {
  return (
    <>
      <Heading>Todo List</Heading>
      <TodoListItems />
    </>
  );
}

export default TodoList;
