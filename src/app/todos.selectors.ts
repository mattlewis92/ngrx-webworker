import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromTodos from "./todos.reducer";

export const selectTodostate = createFeatureSelector<fromTodos.State>(fromTodos.todosFeatureKey);
