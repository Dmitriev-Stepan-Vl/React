import PropTypes from 'prop-types'
import React, {useState, useEffect, useContext} from 'react'
import Context from '../context'

function AddTodo({onCreate, todos, editTodo, setEditTodo, setUpdateTasks}) {
    const [value, setValue] = useState('')
    const urlTasks = 'http://185.246.66.84:3000/sdmitriev/tasks/'
    const urlSubTasks = 'http://185.246.66.84:3000/sdmitriev/subtasks/'
    const {updateTodoSubTasks} = useContext(Context)     

    function updateTodo(title, editTodo, id, completed, sequence) {
        if (!editTodo.taskId) {
            const data = {title: title,completed: completed, sequence: sequence}
            fetch(urlTasks + id, {
            method: 'PUT',
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            body: JSON.stringify(data)
            })
            .catch(err => console.log(err))
            setUpdateTasks(true)
            setEditTodo(null)
        } else {
            const data = {title: title,completed: completed, sequence: sequence, taskId: editTodo.taskId}            
            fetch(urlSubTasks + id, {
            method: 'PUT',
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            body: JSON.stringify(data)
            })
            .catch(err => console.log(err))
            setEditTodo(null)
            updateTodoSubTasks(editTodo.taskId)
        }        
    }

    useEffect(() => {
        if(editTodo) {
            setValue(editTodo.title)
        } else {
            setValue("")
        }
    }, [editTodo])

    function submitHandler(e) {
        e.preventDefault() 
        if(!editTodo) {
            if(value.trim()) {
                onCreate(value)
                setValue('')
            }
        } else {
            updateTodo(value, editTodo, editTodo.id, editTodo.completed, editTodo.sequence)
        }
    }

    return (
        <form className="form" onSubmit={submitHandler}>
            <input className="form-input" value={value} placeholder="Введите задачу..." onChange={e => setValue(e.target.value)}/>
            <button className="form-button" type="submit">
                {editTodo ? "Применить" : "Добавить"}
            </button>
        </form>
    )
}

AddTodo.propTypes = {
    onCreate: PropTypes.func
}

export default AddTodo 