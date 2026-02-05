import { createFeature, createReducer, on } from "@ngrx/store";
import { TodosActions, FilterType } from "./todos.actions";
import { Todo } from "./todo.interface";

export const todosFeatureKey = "todos";

export interface State {
  todos: Todo[];
  filter: FilterType;
  loading: boolean;
}

export const initialState: State = {
  todos: [],
  filter: "all",
  loading: false,
};

export const reducer = createReducer(
  initialState,

  // Load todos
  on(TodosActions.loadTodos, (state) => ({ ...state, loading: true })),
  on(TodosActions.loadTodosSuccess, (state, { data }) => ({
    ...state,
    todos: data,
    loading: false,
  })),
  on(TodosActions.loadTodosFailure, (state) => ({ ...state, loading: false })),

  // Add todo (optimistic)
  on(TodosActions.addTodo, (state, { title, tempId }) => {
    const newTodo: Todo = {
      id: tempId,
      userId: 1,
      title,
      completed: false,
    };
    return { ...state, todos: [newTodo, ...state.todos] };
  }),
  on(TodosActions.addTodoSuccess, (state, { tempId, todo }) => {
    // Keep the tempId since JSONPlaceholder returns the same id (201) for all POSTs
    const todos = state.todos.map((t) => (t.id === tempId ? { ...todo, id: tempId } : t));
    return { ...state, todos };
  }),
  on(TodosActions.addTodoFailure, (state, { tempId }) => ({
    ...state,
    todos: state.todos.filter((t) => t.id !== tempId),
  })),

  // Delete todo (optimistic)
  on(TodosActions.deleteTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter((t) => t.id !== id),
  })),
  on(TodosActions.deleteTodoSuccess, (state) => state),
  on(TodosActions.deleteTodoFailure, (state, { todo }) => ({
    ...state,
    todos: [...state.todos, todo],
  })),

  // Toggle todo (optimistic)
  on(TodosActions.toggleTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
  })),
  on(TodosActions.toggleTodoSuccess, (state) => state),
  on(TodosActions.toggleTodoFailure, (state, { id }) => ({
    ...state,
    todos: state.todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
  })),

  // Update todo title (optimistic)
  on(TodosActions.updateTodo, (state, { id, title }) => ({
    ...state,
    todos: state.todos.map((t) => (t.id === id ? { ...t, title } : t)),
  })),
  on(TodosActions.updateTodoSuccess, (state) => state),
  on(TodosActions.updateTodoFailure, (state, { id, originalTitle }) => ({
    ...state,
    todos: state.todos.map((t) => (t.id === id ? { ...t, title: originalTitle } : t)),
  })),

  // Toggle all todos (optimistic)
  on(TodosActions.toggleAllTodos, (state, { completed }) => ({
    ...state,
    todos: state.todos.map((t) => ({ ...t, completed })),
  })),
  on(TodosActions.toggleAllTodosSuccess, (state) => state),
  on(TodosActions.toggleAllTodosFailure, (state) => state),

  // Clear completed (optimistic)
  on(TodosActions.clearCompleted, (state) => ({
    ...state,
    todos: state.todos.filter((t) => !t.completed),
  })),
  on(TodosActions.clearCompletedSuccess, (state) => state),
  on(TodosActions.clearCompletedFailure, (state, { todos }) => ({
    ...state,
    todos: [...state.todos, ...todos],
  })),

  // Filter
  on(TodosActions.setFilter, (state, { filter }) => ({ ...state, filter })),
);

export const todosFeature = createFeature({
  name: todosFeatureKey,
  reducer,
});
