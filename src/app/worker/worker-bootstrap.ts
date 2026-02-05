import '@angular/compiler';
import {
  DOCUMENT,
  mergeApplicationConfig,
  PLATFORM_ID,
} from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideStore, Store } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { todosFeature } from '../todos.reducer';
import { TodosEffects } from '../todos.effects';
import { StateUpdateMessage, WorkerMessageType, MainThreadMessage } from './worker-protocol';
import {createApplication} from '@angular/platform-browser';
import {platformServer} from '@angular/platform-server';
import {appConfig} from '../app.config';


let store: Store;

export async function bootstrapWorkerStore(): Promise<void> {

  const platform = platformServer();

  const appRef = await createApplication(mergeApplicationConfig(appConfig, {
      providers: [
        {provide: DOCUMENT, useFactory() {
          return platform.injector.get(DOCUMENT);
          }},
        { provide: PLATFORM_ID, useValue: 'worker' },
        provideHttpClient(withFetch()),
        provideStore({
          [todosFeature.name]: todosFeature.reducer,
        }),
        provideEffects([TodosEffects]),
      ]
    }))

  store = appRef.injector.get(Store);

  store.subscribe((state) => {
    const message: StateUpdateMessage = {
      type: WorkerMessageType.STATE_UPDATE,
      state,
    };
    postMessage(message);
  });

  addEventListener('message', ({ data }: MessageEvent<MainThreadMessage>) => {
    if (data.type === WorkerMessageType.DISPATCH) {
      store.dispatch(data.action);
    }
  });
}
