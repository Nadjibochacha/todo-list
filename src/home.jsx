import React, { useEffect, useState } from 'react';
import './home.css';
import { MdDeleteForever, MdOutlineAssignment } from "react-icons/md";
import Swal from 'sweetalert2';

const Home = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        setTasks(storedTasks);
    }, []);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const handeltask = () => {
        console.log('clicked');
    };

    const handeladd = () => {
        Swal.fire({
            title: "Add Task",
            html: `
                <div>
                    <label>Task</label>
                    <input id="swal-input1" type="text" class="swal2-input"/>
                </div>
                <div>
                    <label>Time</label>
                    <input id="swal-input2" type="time" class="swal2-input"/>
                </div>
            `,
            focusConfirm: false,
            preConfirm: () => {
                return [
                    document.getElementById("swal-input1").value,
                    document.getElementById("swal-input2").value
                ];
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const [taskText, taskTime] = result.value;
                setTasks([...tasks, { id: tasks.length + 1, text: taskText, time: taskTime }]);
            }
        });
    };

    const deleteTask = (taskId) => {
        const taskToDelete = tasks.find(task => task.id === taskId);
        const checkbox = document.getElementById(`checkbox-${taskId}`);
        
        if (checkbox && checkbox.checked) {
            Swal.fire("Congratulations!", "You finished your task :)", "success");
        }

        const filteredTasks = tasks.filter(task => task.id !== taskId);
        setTasks(filteredTasks);
    };

    const handelUpdate = (id) => {
        const taskToUpdate = tasks.find(task => task.id === id);
        Swal.fire({
            title: "Update Task",
            html: `
                <div>
                    <label>Task</label>
                    <input id="swal-input1" type="text" value="${taskToUpdate.text}" class="swal2-input"/>
                </div>
                <div>
                    <label>Time</label>
                    <input id="swal-input2" type="time" value="${taskToUpdate.time}" class="swal2-input"/>
                </div>
            `,
            focusConfirm: false,
            preConfirm: () => {
                return [
                    document.getElementById("swal-input1").value,
                    document.getElementById("swal-input2").value
                ];
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const [taskText, taskTime] = result.value;
                const updatedTasks = tasks.map(task =>
                    task.id === id ? { ...task, text: taskText, time: taskTime } : task
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
                <button className='btn btn-success w-25' onClick={handeladd}>Add Task</button>
                {
                    tasks.length > 0 ? (
                        <table className="mt-3">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th colSpan={3}>Task</th>
                                    <th>Time</th>
                                    <th>Operations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
                                    <tr key={task.id}>
                                        <td>
                                            <input 
                                                type="checkbox" 
                                                id={`checkbox-${task.id}`} 
                                                onChange={handeltask} 
                                            />
                                        </td>
                                        <td colSpan={3}>{task.text}</td>
                                        <td>{task.time}</td>
                                        <td>
                                            <span className='me-2' onClick={() => deleteTask(task.id)}><MdDeleteForever /></span>
                                            <span onClick={() => handelUpdate(task.id)}><MdOutlineAssignment /></span>
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
        </div>
    );
};

export default Home;
