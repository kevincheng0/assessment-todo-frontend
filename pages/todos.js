import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PageLayout from '../components/PageLayout';
import apiFetch from '../functions/apiFetch';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import TodoItem from '../components/Todo';
import Tabs from '../components/Tabs';


const Todos = () => {
    const dispatch = useDispatch();
    // Fetch all todos for user
    useEffect(() => {
        dispatch({ type: 'TODO/SET-STATUS', payload: { status: 'pending' }})

        apiFetch("/todo").then(response => response.body).then(response => {
            dispatch({ type: 'TODO/TODOS-LOADED', payload: { items: response } })
            dispatch({ type: 'TODO/SET-STATUS', payload: { status: 'idle' }})
        });
    }, [])


    const incompleteTodoIds = useSelector(state => state.todos.items.filter(todo => !todo.isDone).map(todo => todo.todoID), shallowEqual);
    const completeTodoIds = useSelector(state => state.todos.items.filter(todo => todo.isDone).map(todo => todo.todoID), shallowEqual);
    const status = useSelector(state => state.todos.status)

    const [activeTab,  setActiveTab] = useState('Incomplete');

    const incompleteTodoItems = incompleteTodoIds.map(todoID => {
        return <TodoItem key={todoID} todoID={todoID}/>
    });

    const completeTodoItems = completeTodoIds.map(todoID => {
        return <TodoItem key={todoID} todoID={todoID}/>
    });

    const tabsProps = [
        {
            title: "Incomplete",
            content: 
                <div>
                    { incompleteTodoItems }
                </div>
            ,
            onClick: _ => setActiveTab('Incomplete'),
        },
        {
            title: "Complete",
            content: (
                <div>
                    { completeTodoItems }
                </div>
            ),
            onClick: _ => setActiveTab('Complete'),
        }
    ];

    return (
        <PageLayout title="Todos">
            <Container>
                <Title> Todos </Title>
                <Tabs activeTab={activeTab} tabs={tabsProps}/>
                {
                    status === 'pending'
                        ? <p1>Loading...</p1>
                        : null
                }
            </Container>
        </PageLayout>
    )
}

export default Todos;

const Title = styled.h1`
    margin-bottom: 10px;
    font-weight: bold;
    font-size: 24px;
`

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;
