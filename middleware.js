import { NextResponse } from 'next/server';
import config from './config';
import apiFetch from './functions/apiFetch';
import getAuthHeaders from './functions/getAuthHeaders';
import { clearTodoAlerts, clearTodoBody, updateTodoError, updateTodoName, updateTodoSuccess, addTodo } from './actions/todo';


export async function middleware(req, event) {
    // Prevent users that aren't signed in from accessing certain protected pages
    if (req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/create' || req.nextUrl.pathname === '/todos') {
        try {
            let response = await apiFetch("/user/session", {
                headers: getAuthHeaders(req)
            });
            if (response.status !== 200) {
                throw("Unauthorized");
            }
            else {
                return NextResponse.next();
            }
        }
        catch (err) {
            console.log(err);
            return NextResponse.redirect(`${config.FRONT_END_URL}/signin`);
        }
    } 
    else {
        return NextResponse.next();
    }
}

// Middleware for handling MongoDB updates. Intercepts dispatch and sends API request.
// After receiving a response, update the payload and continue the dispatch.
export const mongoUpdateMiddleware = store => next => async action => {
    // Only handle actions to add or update todos
    if (action.type !== 'TODO/ADD-TODO' && action.type !== 'TODO/UPDATE-NAME' && action.type !== 'TODO/SET-DONE') {
      return next(action);
    }

    store.dispatch({
        type: 'TODO/SET-STATUS',
        payload: { status: 'pending' },
    });

    let response;  
    switch (action.type) {
        case ('TODO/ADD-TODO'): {
            const { newTodo } = action.payload;

            response = await apiFetch("/todo", {
                body: {
                    name: newTodo.name,
                    isDone: false,
                }, 
                method: "POST"
            });

            if (response.status === 201) {
                store.dispatch(updateTodoSuccess({ success: `Todo ${newTodo.name} updated successfully` }));
            } else {
                store.dispatch(updateTodoError({ error: response.body.error }));
            }
            
            action.payload.newTodo.todoID = response.body.insertedId;
            action.payload.newTodo.created = response.body.created;
            break;
        };
        case ('TODO/UPDATE-NAME'): {
            const { todoID, newName } = action.payload;

            response = await apiFetch("/todo/name", {
                body: {
                    todoID,
                    name: newName,
                }, 
                method: "PUT"
            });


            if (response.status === 201) {
                store.dispatch(updateTodoSuccess({ success: `Todo name updated successfully` }));
            } else {
                // Don't update name in store if API error
                store.dispatch(updateTodoError({ error: response.body.error }));
                store.dispatch({
                    type: 'TODO/SET-STATUS',
                    payload: { status: 'idle' },
                });
                return;
            }

            break;
        };
        case ('TODO/SET-DONE'): {
            const { todoID, isDone } = action.payload;

            response = await apiFetch("/todo/isDone", {
                body: {
                    todoID,
                    isDone,
                }, 
                method: "PUT"
            });

            if (response.status === 201) {
                store.dispatch(updateTodoSuccess({ success: `Todo completed status updated successfully` }));
            } else {
                // Don't update isDone in store if error
                store.dispatch(updateTodoError({ error: response.body.error }));
                store.dispatch({
                    type: 'TODO/SET-STATUS',
                    payload: { status: 'idle' },
                });
                return;
            }
            break;
        }
        default:
            break;
    }
    
    // No longer waiting for response, set idle
    store.dispatch({
        type: 'TODO/SET-STATUS',
        payload: { status: 'idle' },
    });
  
    return next(action);
  };