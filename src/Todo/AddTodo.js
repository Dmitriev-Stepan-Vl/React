import PropTypes from 'prop-types'
import React, {useState, useEffect} from 'react'

function AddTodo({onCreate, todos, editTodo, setEditTodo, setUpdateTasks}) {
    const [value, setValue] = useState('')
    const urlTasks = 'http://185.246.66.84:3000/sdmitriev/tasks/'

    function updateTodo(title, id, completed, sequence) {
        const data = {title: title,completed: completed, sequence: sequence}
        todos.map((todo) => 
            todo.id === id ?  data : todo
        )
        fetch(urlTasks + id, {
        method: 'PUT',
        headers: {'Content-type': 'application/json; charset=UTF-8'},
        body: JSON.stringify(data)
        })
        .then(setUpdateTasks(true))
        .catch(err => console.log(err))
        //setTodos(newTodo)
        setEditTodo(null)
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
            updateTodo(value, editTodo.id, editTodo.completed, editTodo.sequence)
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