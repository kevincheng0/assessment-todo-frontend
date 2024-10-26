
// TODO/ERROR
export const updateTodoError = ({error = ""}) => ({
    type: 'TODO/ERROR',
    error
});

// TODO/ERROR
export const updateTodoSuccess = ({success = ""}) => ({
    type: 'TODO/SUCCESS',
    success
});

// TODO/CLEAR-ALERTS
export const clearTodoAlerts = () => ({
    type: 'TODO/CLEAR-ALERTS'
});

// TODO/ADD-TODO
export const addTodo = (name) => ({
    type: 'TODO/ADD-TODO',
    payload: {
        newTodo: {
            name,
            isDone: false,
        }
    }
});