import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Todo } from "./todo.interface";

export type FilterType = "all" | "active" | "completed";

export const TodosActions = createActionGroup({
  source: "Todos",
  events: {
    // Load todos
    "Load Todos": emptyProps(),
    "Load Todos Success": props<{ data: Todo[] }>(),
    "Load Todos Failure": props<{ error: unknown }>(),

    // Add todo
    "Add Todo": props<{ title: string; tempId: number }>(),
    "Add Todo Success": props<{ tempId: number; todo: Todo }>(),
    "Add Todo Failure": props<{ tempId: number; error: unknown }>(),

    // Delete todo
    "Delete Todo": props<{ id: number }>(),
    "Delete Todo Success": props<{ id: number }>(),
    "Delete Todo Failure": props<{ todo: Todo; error: unknown }>(),

    // Toggle todo completion
    "Toggle Todo": props<{ id: number }>(),
    "Toggle Todo Success": props<{ todo: Todo }>(),
    "Toggle Todo Failure": props<{ id: number; error: unknown }>(),

    // Update todo title
    "Update Todo": props<{ id: number; title: string }>(),
    "Update Todo Success": props<{ todo: Todo }>(),
    "Update Todo Failure": props<{ id: number; originalTitle: string; error: unknown }>(),

    // Toggle all todos
    "Toggle All Todos": props<{ completed: boolean }>(),
    "Toggle All Todos Success": props<{ todos: Todo[] }>(),
    "Toggle All Todos Failure": props<{ error: unknown }>(),

    // Clear completed
    "Clear Completed": emptyProps(),
    "Clear Completed Success": props<{ ids: number[] }>(),
    "Clear Completed Failure": props<{ todos: Todo[]; error: unknown }>(),

    // Filter
    "Set Filter": props<{ filter: FilterType }>(),
  },
});
