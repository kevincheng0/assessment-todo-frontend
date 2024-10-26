
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


const formatter = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: 'numeric'
});

const Todo = ({ todoID }) => {
    const dispatch = useDispatch();
    const todo = useSelector(state => 
      state.todos.items.find(todo => todo.todoID === todoID)
    );
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(todo.name);
  
    if (!todo) {
      return null;
    }

    const updateTodoName = () => { 
        dispatch({
            type: 'TODO/UPDATE-NAME',
            payload: { todoID, newName: name }
        });
    }
    const toggleTodoDone = () => {
        dispatch({ 
            type: 'TODO/SET-DONE',
            payload: { todoID, isDone: !todo.isDone }}
        );
    }

    const date = new Date(todo.created);
    const prettyDate = formatter.format(date);

    return (
        <div className="todoItem">
            {
                isEditing
                    ? <input name="newName" className="todoItem-label" value={name} onChange={(e) => setName(e.target.value)}/>
                    : <label className="todoItem-label"> {todo.name} </label>
            }
            <p> | Created: {prettyDate} | </p>
            <button type="button" onClick={() => setIsEditing(true)}> Edit </button>
            {
                isEditing
                    ? <button onClick={() => {
                        setIsEditing(false);
                        updateTodoName();
                    }}> Save </button>
                    : <button onClick={toggleTodoDone}> Set { todo.isDone ? 'incomplete' : 'complete' } </button>
            }

        </div>
    );
};


export default Todo;