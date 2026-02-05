import { createFeature, createReducer, on } from "@ngrx/store";
import { TodosActions } from "./todos.actions";
import { Todo } from "./todo.interface";

export const todosFeatureKey = "todos";

export interface State {
  todos: Todo[];
}

export const initialState: State = {
  todos: [],
};

export const reducer = createReducer(
  initialState,
  on(TodosActions.loadTodos, (state) => state),
  on(TodosActions.loadTodosSuccess, (state, action) => {
    return { ...state, todos: action.data };
  }),
  on(TodosActions.loadTodosFailure, (state, action) => state),
);

export const todosFeature = createFeature({
  name: todosFeatureKey,
  reducer,
});
