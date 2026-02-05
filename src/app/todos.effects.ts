import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, concatMap } from "rxjs/operators";
import { Observable, EMPTY, of } from "rxjs";
import { TodosActions } from "./todos.actions";
import { HttpClient } from "@angular/common/http";
import { Todo } from "./todo.interface";

@Injectable()
export class TodosEffects {
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);

  loadTodos$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodosActions.loadTodos),
      concatMap(() =>
        this.http.get<Todo[]>("https://jsonplaceholder.typicode.com/todos").pipe(
          map((data) => TodosActions.loadTodosSuccess({ data })),
          catchError((error) => of(TodosActions.loadTodosFailure({ error }))),
        ),
      ),
    );
  });
}
