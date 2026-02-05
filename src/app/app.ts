import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TodosActions, FilterType } from "./todos.actions";
import { WorkerStoreFacade } from "./worker/worker-store-facade";
import {
  selectFilteredTodos,
  selectFilter,
  selectLoading,
  selectActiveCount,
  selectAllCompleted,
  selectHasCompletedTodos,
  selectHasTodos,
} from "./todos.selectors";

@Component({
  selector: "app-root",
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
  imports: [FormsModule],
})
export class App {
  private readonly store = inject(WorkerStoreFacade);

  // Store selectors
  protected readonly filteredTodos = this.store.selectSignal(selectFilteredTodos);
  protected readonly filter = this.store.selectSignal(selectFilter);
  protected readonly loading = this.store.selectSignal(selectLoading);
  protected readonly activeCount = this.store.selectSignal(selectActiveCount);
  protected readonly allCompleted = this.store.selectSignal(selectAllCompleted);
  protected readonly hasCompletedTodos = this.store.selectSignal(selectHasCompletedTodos);
  protected readonly hasTodos = this.store.selectSignal(selectHasTodos);

  // Local signals
  protected readonly newTodoTitle = signal("");
  protected readonly editingTodoId = signal<number | null>(null);
  protected readonly editingTitle = signal("");

  private tempIdCounter = -1;

  constructor() {
    this.store.dispatch(TodosActions.loadTodos());
  }

  addTodo(): void {
    const title = this.newTodoTitle().trim();
    if (title) {
      const tempId = this.tempIdCounter--;
      this.store.dispatch(TodosActions.addTodo({ title, tempId }));
      this.newTodoTitle.set("");
    }
  }

  deleteTodo(id: number): void {
    this.store.dispatch(TodosActions.deleteTodo({ id }));
  }

  toggleTodo(id: number): void {
    this.store.dispatch(TodosActions.toggleTodo({ id }));
  }

  toggleAll(): void {
    const completed = !this.allCompleted();
    this.store.dispatch(TodosActions.toggleAllTodos({ completed }));
  }

  startEditing(id: number, title: string): void {
    this.editingTodoId.set(id);
    this.editingTitle.set(title);
  }

  saveEdit(): void {
    const id = this.editingTodoId();
    const title = this.editingTitle().trim();
    if (id !== null && title) {
      this.store.dispatch(TodosActions.updateTodo({ id, title }));
    }
    this.cancelEdit();
  }

  cancelEdit(): void {
    this.editingTodoId.set(null);
    this.editingTitle.set("");
  }

  setFilter(filter: FilterType): void {
    this.store.dispatch(TodosActions.setFilter({ filter }));
  }

  clearCompleted(): void {
    this.store.dispatch(TodosActions.clearCompleted());
  }
}
