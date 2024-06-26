import React from 'react'
import { useState } from 'react'
import '../styles/TaskForm.css'
import AddTaskIcon from '@mui/icons-material/AddTask';
import { Button } from '@mui/material';
import axios from 'axios'
import {collection, addDoc} from "firebase/firestore"
import {db} from "../firebase"
import { useCategory } from '../contexts/CategoryContext';

const TaskForm = ({tasks, setTasks}) => {
    const [newTask, setNewTask] = useState('');
    const {currCategory} = useCategory();

    const AddTask = async ()=>{
        if(newTask.length === 0)return;
        const id = tasks.length? tasks[tasks.length-1].id+1: 1;
        const adderTask= {id, isChecked: false, name:newTask, categoryId:currCategory.id}
        const newList = [...tasks, adderTask];
        
        setTasks(newList)
        
        try {
          // const response = await axios.post('http://localhost:3000/tasks', adderTask)
            setNewTask('')
            const docRef = await(addDoc(collection(db, 'tasks'), adderTask));
            const updatedList = newList.map((item)=>{
              if(item.id === id)
                {
                  return {...item, firebaseId: docRef.id};
                }
              return item;
            })
            setTasks(updatedList);
        }
        catch(err)
        {
          console.log(err)
        }
        
    }
  return (
    <form className='taskform' onSubmit={(e)=>{e.preventDefault()}}>
        <input
            placeholder='Add a Task'
            value={newTask}
            onChange={(e)=>{setNewTask(e.target.value)}}
            className='input'
        ></input>
        <button className='button' onClick={()=>{AddTask()}}><AddTaskIcon/></button>
    </form>
  )
}

export default TaskForm