import React, { useEffect, useState } from 'react';
import './home.css';
import { MdDeleteForever, MdOutlineAssignment } from "react-icons/md";
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [time, setTime] = useState(new Date());

    const notify = (task) => toast(`The task : ${task.text} started now at ${task.time} !!`);

    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        setTasks(storedTasks);
    }, []);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 60000); // Update time every minute

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const currentTime = time.toTimeString().slice(0, 5); // Get "HH:MM" format
        tasks.forEach((task) => {
            if (task.time === currentTime) {
                notify(task);
            }
        });
    }, [time, tasks]);

    const handleTaskCompletion = (taskId) => {
        Swal.fire("Congratulations!", "You finished your task :)", "success");
    };

    const handleAddTask = () => {
        Swal.fire({
            title: "Add Task",
            html: `
                <div className="row">
                    <label className="col-3">Task</label>
                    <input id="swal-input1" type="text" class="col-9 swal2-input"/>
                </div>
                <div className="row">
                    <label className="col-3">Time</label>
                    <input id="swal-input2" type="time" class="col-9 swal2-input"/>
                </div>
                <div className="row">
                    <label className="col-3">Importance</label>
                    <input id="swal-input3" type="text" class="col-9 swal2-input"/>
                </div>
            `,
            focusConfirm: false,
            preConfirm: () => {
                return [
                    document.getElementById("swal-input1").value,
                    document.getElementById("swal-input2").value,
                    document.getElementById("swal-input3").value
                ];
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const [taskText, taskTime, taskImportance] = result.value;
                setTasks([...tasks, { id: tasks.length + 1, text: taskText, time: taskTime, importance: taskImportance }]);
            }
        });
    };

    const handleDeleteTask = (taskId) => {
        const filteredTasks = tasks.filter(task => task.id !== taskId);
        setTasks(filteredTasks);
    };

    const handleUpdateTask = (id) => {
        const taskToUpdate = tasks.find(task => task.id === id);
        Swal.fire({
            title: "Update Task",
            html: `
                <div className="row">
                    <label className="col-3">Task</label>
                    <input id="swal-input1" type="text" value="${taskToUpdate.text}" class="col-9 swal2-input"/>
                </div>
                <div className="row">
                    <label className="col-3">Time</label>
                    <input id="swal-input2" type="time" value="${taskToUpdate.time}" class="col-9 swal2-input"/>
                </div>
                <div className="row">
                    <label className="col-3">Importance</label>
                    <input id="swal-input3" type="text" value="${taskToUpdate.importance}" class="col-9 swal2-input"/>
                </div>
            `,
            focusConfirm: false,
            preConfirm: () => {
                return [
                    document.getElementById("swal-input1").value,
                    document.getElementById("swal-input2").value,
                    document.getElementById("swal-input3").value,
                ];
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const [taskText, taskTime, taskImportance] = result.value;
                const updatedTasks = tasks.map(task =>
                    task.id === id ? { ...task, text: taskText, time: taskTime, importance: taskImportance } : task
                );
                setTasks(updatedTasks);
            }
        });
    };

    return (
        <div id='todo'>
            <div className='header'>
                <h1>To Do List</h1>
                <h5>Mark all tasks today!</h5>
            </div>
            <div className="content mt-3 p-1">
                <button className='btn btn-success w-25' onClick={handleAddTask}>Add Task</button>
                {
                    tasks.length > 0 ? (
                        <table className="mt-3">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th colSpan={3}>Task</th>
                                    <th>Time</th>
                                    <th>Importance</th>
                                    <th>Operations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
                                    <tr key={task.id}>
                                        <td>
                                            <input type="checkbox" id={`checkbox-${task.id}`} onChange={() => handleTaskCompletion(task.id)} />
                                        </td>
                                        <td colSpan={3}>{task.text}</td>
                                        <td>{task.time}</td>
                                        <td>{task.importance}</td>
                                        <td>
                                            <span className='me-2' onClick={() => handleDeleteTask(task.id)}><MdDeleteForever /></span>
                                            <span onClick={() => handleUpdateTask(task.id)}><MdOutlineAssignment /></span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className='text-white mt-3'>No tasks today, enjoy your day :)</p>
                    )
                }
            </div>
            <div>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Home;
