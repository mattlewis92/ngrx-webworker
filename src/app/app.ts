import {Component, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Store} from '@ngrx/store';
import {todosFeature} from './todos.reducer';
import {TodosActions} from './todos.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly store = inject(Store);
  protected readonly todos = this.store.selectSignal(todosFeature.selectTodos);

  constructor() {
    this.store.dispatch(TodosActions.loadTodos());
  }
}

if (typeof Worker !== 'undefined') {
  // Create a new
  const worker = new Worker(new URL('./app.worker', import.meta.url));
  worker.onmessage = ({ data }) => {
    console.log(`page got message: ${data}`);
  };
  worker.postMessage('hello');
} else {
  // Web Workers are not supported in this environment.
  // You should add a fallback so that your program still executes correctly.
}