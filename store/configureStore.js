import { createStore, combineReducers, applyMiddleware } from 'redux';
import signIn from '../reducers/signIn';
import signUp from '../reducers/signUp';
import todos from '../reducers/todos';
import { mongoUpdateMiddleware } from '../middleware';


let store;

export default  () => {
    if (store) {
        return store;
    }
    //Store creation
    store = createStore(
        combineReducers({
            signIn,
            signUp,
            todos
        }),
        applyMiddleware(mongoUpdateMiddleware),
    );

    return store;
};

