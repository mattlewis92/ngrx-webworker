import { Component, inject } from "@angular/core";
import { todosFeature } from "./todos.reducer";
import { TodosActions } from "./todos.actions";
import { WorkerStoreFacade } from "./worker/worker-store-facade";

@Component({
  selector: "app-root",
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
})
export class App {
  private readonly store = inject(WorkerStoreFacade);
  protected readonly todos = this.store.selectSignal(todosFeature.selectTodos);

  constructor() {
    this.store.dispatch(TodosActions.loadTodos());
  }
}
