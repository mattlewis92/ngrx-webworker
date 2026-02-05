import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { catchError, map, concatMap, switchMap } from "rxjs/operators";
import { of, forkJoin } from "rxjs";
import { TodosActions } from "./todos.actions";
import { HttpClient } from "@angular/common/http";
import { Todo } from "./todo.interface";
import { selectAllTodos } from "./todos.selectors";

const API_URL = "https://jsonplaceholder.typicode.com/todos";

@Injectable()
export class TodosEffects {
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);
  private readonly store = inject(Store);

  loadTodos$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodosActions.loadTodos),
      concatMap(() =>
        this.http.get<Todo[]>(`${API_URL}?_limit=10`).pipe(
          map((data) => TodosActions.loadTodosSuccess({ data })),
          catchError((error) => of(TodosActions.loadTodosFailure({ error }))),
        ),
      ),
    );
  });

  addTodo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodosActions.addTodo),
      concatMap(({ title, tempId }) =>
        this.http.post<Todo>(API_URL, { title, completed: false, userId: 1 }).pipe(
          map((todo) => TodosActions.addTodoSuccess({ tempId, todo })),
          catchError((error) => of(TodosActions.addTodoFailure({ tempId, error }))),
        ),
      ),
    );
  });

  deleteTodo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodosActions.deleteTodo),
      concatLatestFrom(() => this.store.select(selectAllTodos)),
      concatMap(([{ id }, todos]) => {
        const todo = todos.find((t) => t.id === id);
        return this.http.delete(`${API_URL}/${id}`).pipe(
          map(() => TodosActions.deleteTodoSuccess({ id })),
          catchError((error) => of(TodosActions.deleteTodoFailure({ todo: todo!, error }))),
        );
      }),
    );
  });

  toggleTodo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodosActions.toggleTodo),
      concatLatestFrom(() => this.store.select(selectAllTodos)),
      concatMap(([{ id }, todos]) => {
        const todo = todos.find((t) => t.id === id);
        return this.http.patch<Todo>(`${API_URL}/${id}`, { completed: todo?.completed }).pipe(
          map((updatedTodo) => TodosActions.toggleTodoSuccess({ todo: updatedTodo })),
          catchError((error) => of(TodosActions.toggleTodoFailure({ id, error }))),
        );
      }),
    );
  });

  updateTodo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodosActions.updateTodo),
      concatLatestFrom(() => this.store.select(selectAllTodos)),
      concatMap(([{ id, title }, todos]) => {
        const originalTitle = todos.find((t) => t.id === id)?.title || "";
        return this.http.patch<Todo>(`${API_URL}/${id}`, { title }).pipe(
          map((updatedTodo) => TodosActions.updateTodoSuccess({ todo: updatedTodo })),
          catchError((error) => of(TodosActions.updateTodoFailure({ id, originalTitle, error }))),
        );
      }),
    );
  });

  toggleAllTodos$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodosActions.toggleAllTodos),
      concatLatestFrom(() => this.store.select(selectAllTodos)),
      switchMap(([{ completed }, todos]) => {
        const requests = todos.map((todo) =>
          this.http.patch<Todo>(`${API_URL}/${todo.id}`, { completed }),
        );
        if (requests.length === 0) {
          return of(TodosActions.toggleAllTodosSuccess({ todos: [] }));
        }
        return forkJoin(requests).pipe(
          map((updatedTodos) => TodosActions.toggleAllTodosSuccess({ todos: updatedTodos })),
          catchError((error) => of(TodosActions.toggleAllTodosFailure({ error }))),
        );
      }),
    );
  });

  clearCompleted$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodosActions.clearCompleted),
      concatLatestFrom(() => this.store.select(selectAllTodos)),
      switchMap(([, todos]) => {
        const completedTodos = todos.filter((t) => t.completed);
        const requests = completedTodos.map((todo) => this.http.delete(`${API_URL}/${todo.id}`));
        const ids = completedTodos.map((t) => t.id);
        if (requests.length === 0) {
          return of(TodosActions.clearCompletedSuccess({ ids: [] }));
        }
        return forkJoin(requests).pipe(
          map(() => TodosActions.clearCompletedSuccess({ ids })),
          catchError((error) => of(TodosActions.clearCompletedFailure({ todos: completedTodos, error }))),
        );
      }),
    );
  });
}
