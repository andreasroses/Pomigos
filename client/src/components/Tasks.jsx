import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { socket } from '../socket';
function Tasks({ boardID }) {
    const [isAdding, setIsAdding] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [editableTaskId, setEditableTaskId] = useState(null);
    const [inputName, setInputName] = useState('');
    const [inputDescription, setInputDescription] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        if (isAdding && tasks.length > 0) {
            const newTask = tasks[tasks.length - 1];
            setEditableTaskId(newTask.task_id);
            setInputName(newTask.task_name);
            setInputDescription(newTask.task_description);
            setIsAdding(false);
        }
    }, [isAdding, tasks, setIsAdding]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/tasks', {
                params: { board_id: boardID }
            });
            const data = response.data; // Axios handles JSON parsing
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        }
    };

    const addTask = async () => {
        try {
            await axios.post(
                "http://localhost:5000/add_board",
                {
                    task_name: "New task",
                    task_description: "some desc",
                    board_id: boardID,
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            fetchTasks();
            setIsAdding(true);
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    };

    const updateTask = async (id) => {
        try {
            await fetch(`http://localhost:5000/update_task/${id}`, { // Ensure this endpoint exists
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task_name: inputName, task_description: inputDescription })
            });
            fetchTasks();
            setEditableTaskId(null);
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await fetch(`http://localhost:5000/delete_task/${id}`, { // Ensure this endpoint exists
                method: 'DELETE'
            });
            fetchTasks();
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const completeTask = async (id) => {
        try {
            await fetch(`http://localhost:5000/complete_task/${id}`, { // Ensure this endpoint exists
                method: 'POST'
            });
            fetchTasks();
        } catch (error) {
            console.error('Failed to complete task:', error);
        }
    };

    const handleNameChange = (e) => {
        setInputName(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setInputDescription(e.target.value);
    };

    const handleBlur = (id) => {
        updateTask(id);
    };

    const handleKeyDown = (e, id) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
    };

    return (
        <>
            <button onClick={addTask}>Add Task</button>
            {tasks.map((task) => (
                <div className="card card-compact w-96" key={task.task_id}>
                    <div className="card-body card-secondary">
                        {editableTaskId === task.task_id ? (
                            <>
                                <input
                                    type="text"
                                    value={inputName}
                                    onChange={handleNameChange}
                                    onBlur={() => handleBlur(task.task_id)}
                                    onKeyDown={(e) => handleKeyDown(e, task.task_id)}
                                    autoFocus
                                />
                                <input
                                    type="text"
                                    value={inputDescription}
                                    onChange={handleDescriptionChange}
                                    onBlur={() => handleBlur(task.task_id)}
                                    onKeyDown={(e) => handleKeyDown(e, task.task_id)}
                                />
                            </>
                        ) : (
                            <>
                                <h2 className="card-title text-xl" onClick={() => {
                                    setEditableTaskId(task.task_id);
                                    setInputName(task.task_name);
                                    setInputDescription(task.task_description);
                                }}>
                                    {task.task_name || 'New Task'}
                                </h2>
                                <p>{task.task_description || 'Task Description'}</p>
                            </>
                        )}
                        <button onClick={() => deleteTask(task.task_id)}>Delete</button>
                        <button onClick={() => completeTask(task.task_id)}>Complete</button>
                    </div>
                </div>
            ))}
        </>
    );
}

export default Tasks;