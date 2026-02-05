import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {Todo} from './todo.interface';

export const TodosActions = createActionGroup({
  source: 'Todos',
  events: {
    'Load Todos': emptyProps(),
    'Load Todos Success': props<{ data: Todo[] }>(),
    'Load Todos Failure': props<{ error: unknown }>(),
  }
});
