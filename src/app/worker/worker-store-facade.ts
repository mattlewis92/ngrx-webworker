import { computed, Injectable, Signal, signal } from "@angular/core";
import { Action } from "@ngrx/store";
import { DispatchMessage, WorkerMessageType, WorkerThreadMessage } from "./worker-protocol";
import { initialState as todosInitialState, todosFeatureKey } from "../todos.reducer";

@Injectable({ providedIn: "root" })
export class WorkerStoreFacade {
  private worker: Worker | null = null;
  private readonly stateSignal = signal<Record<string, unknown>>({
    [todosFeatureKey]: todosInitialState,
  });

  constructor() {
    this.initWorker();
  }

  private initWorker(): void {
    if (typeof Worker === "undefined") {
      console.warn("Web Workers are not supported in this environment");
      return;
    }

    this.worker = new Worker(new URL("../app.worker", import.meta.url));

    this.worker.onmessage = ({ data }: MessageEvent<WorkerThreadMessage>) => {
      switch (data.type) {
        case WorkerMessageType.STATE_UPDATE:
          this.stateSignal.set(data.state as Record<string, unknown>);
          break;
        case WorkerMessageType.ERROR:
          console.error("Worker error:", data.error);
          break;
      }
    };

    this.worker.onerror = (error) => {
      console.error("Worker initialization error:", error);
    };
  }

  dispatch(action: Action): void {
    if (!this.worker) {
      console.warn("Worker not initialized, cannot dispatch action");
      return;
    }

    const message: DispatchMessage = {
      type: WorkerMessageType.DISPATCH,
      action,
    };
    this.worker.postMessage(message);
  }

  selectSignal<T>(selector: (state: Record<string, unknown>) => T): Signal<T> {
    return computed(() => selector(this.stateSignal()));
  }
}
