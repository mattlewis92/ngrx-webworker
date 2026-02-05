import { Action } from "@ngrx/store";

export const enum WorkerMessageType {
  DISPATCH = "DISPATCH",
  STATE_UPDATE = "STATE_UPDATE",
  ERROR = "ERROR",
}

export interface DispatchMessage {
  type: WorkerMessageType.DISPATCH;
  action: Action;
}

export interface StateUpdateMessage {
  type: WorkerMessageType.STATE_UPDATE;
  state: unknown;
}

export interface ErrorMessage {
  type: WorkerMessageType.ERROR;
  error: string;
}

export type WorkerMessage = DispatchMessage | StateUpdateMessage | ErrorMessage;

export type MainThreadMessage = DispatchMessage;
export type WorkerThreadMessage = StateUpdateMessage | ErrorMessage;
