import React, { useState } from 'react';
import styled from 'styled-components';
import { Colours, Typography } from '../definitions';
import Button from '../components/Button';
import PageLayout from '../components/PageLayout';
import { clearTodoAlerts, addTodo } from '../actions/todo';
import Form from '../components/Form';
import InputField from '../components/InputField';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '../components/Alert';

// Save the new todo as React state until it's saved
const Create = () => {
    const dispatch = useDispatch();
    const alerts = useSelector(state => state.todos.alerts);
    const status = useSelector(state => state.todos.status)

    const [todo, setTodo] = useState({});

    const isSaving = status !== 'idle';
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (todo.name) {
            dispatch(addTodo(todo.name))
            setTodo({});
            dispatch(clearTodoAlerts());
        }
    };

    return (
        <PageLayout title="Create todo">
            <Container>
                <div className="content">
                    <h1>Create todo</h1>
                    <Alert message={alerts.error} onClose={() => dispatch(clearTodoAlerts())} />
                    <Alert message={alerts.success} onClose={() => dispatch(clearTodoAlerts())} variant="success" />
                    <Form onSubmit={handleSubmit}>
                        <InputField className="input" type="text" placeholder="Todo item name" required value={todo.name ?? ''} onChange={e => setTodo({ name: e.target.value })}/>
                        <Button className="saveButton" type="submit" text="Save" size="large" variant="primary" disabled={isSaving || !todo.name} isFullWidth />
                    </Form>
                </div>
            </Container>
        </PageLayout>
    );
};

export default Create;

const Container = styled.div`
    width: 100%;

    .content {
        h1 {
            color: ${Colours.BLACK};
            font-size: ${Typography.HEADING_SIZES.M};
            font-weight: ${Typography.WEIGHTS.LIGHT};
            line-height: 2.625rem;
            margin-bottom: 2rem;
            margin-top: 1rem;
        }

        .saveButton {
            margin-top: 1rem;
        }
    }
`;