const defaultState = {
    items: [],
    status: 'idle',
    alerts: {
        error: "",
        success: ""
    }
};

/*
 * The todos store structure has been changed. Instead of storing the todo being created in <Create>, 
 * that todo is saved as React state, which I think is easier to read and use.
 * This file has been updated to store a list of todos (items) along with loading status and errors.
 */
export default (state = defaultState, action) => {
    switch(action.type) {
        case ('TODO/TODOS-LOADED'): {
            return {
                ...state,
                items: action.payload.items,
            }
        };
        case 'TODO/ADD-TODO':
            return {
                ...state,
                items: [...state.items, action.payload.newTodo]
            };
        case 'TODO/UPDATE-NAME':
            return {
                ...state,
                items: state.items.map(todo => 
                    todo.todoID === action.payload.todoID
                        ? { ...todo, name: action.payload.newName }
                        : todo
                ),
            };
        case 'TODO/SET-DONE':
            return {
                ...state,
                items: state.items.map(todo => 
                    todo.todoID === action.payload.todoID
                        ? { ...todo, isDone: action.payload.isDone }
                        : todo
                ),
            };
        case 'TODO/SET-STATUS':
            return {
                ...state,
                status: action.payload.status,
            };
        case 'TODO/ERROR':
            return {
                ...state,
                alerts: {
                    ...defaultState.alerts,
                    error: action.error
                }
            };
        case 'TODO/SUCCESS':
            return {
                ...state,
                alerts: {
                    ...defaultState.alerts,
                    success: action.success
                }
            };
        case 'TODO/CLEAR-ALERTS':
            return {
                ...state,
                alerts: {
                    ...defaultState.alerts
                }
            };
        default:
            return state;
    }
};