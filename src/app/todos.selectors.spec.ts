import * as fromTodos from './todos.reducer';
import { selectTodostate } from './todos.selectors';

describe('Todos Selectors', () => {
  it('should select the feature state', () => {
    const result = selectTodostate({
      [fromTodos.todosFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
