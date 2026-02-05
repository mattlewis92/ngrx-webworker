import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromTodos from "./todos.reducer";

export const selectTodosState = createFeatureSelector<fromTodos.State>(fromTodos.todosFeatureKey);

export const selectAllTodos = createSelector(selectTodosState, (state) => state.todos);

export const selectFilter = createSelector(selectTodosState, (state) => state.filter);

export const selectLoading = createSelector(selectTodosState, (state) => state.loading);

export const selectFilteredTodos = createSelector(selectAllTodos, selectFilter, (todos, filter) => {
  switch (filter) {
    case "active":
      return todos.filter((t) => !t.completed);
    case "completed":
      return todos.filter((t) => t.completed);
    default:
      return todos;
  }
});

export const selectActiveCount = createSelector(
  selectAllTodos,
  (todos) => todos.filter((t) => !t.completed).length,
);

export const selectCompletedCount = createSelector(
  selectAllTodos,
  (todos) => todos.filter((t) => t.completed).length,
);

export const selectTotalCount = createSelector(selectAllTodos, (todos) => todos.length);

export const selectAllCompleted = createSelector(
  selectAllTodos,
  selectTotalCount,
  (todos, total) => total > 0 && todos.every((t) => t.completed),
);

export const selectHasCompletedTodos = createSelector(selectCompletedCount, (count) => count > 0);

export const selectHasTodos = createSelector(selectTotalCount, (count) => count > 0);
