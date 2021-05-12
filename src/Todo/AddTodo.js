import PropTypes from 'prop-types'
import React, {useState, useEffect} from 'react'

function AddTodo({onCreate, todos, setTodos, editTodo, setEditTodo}) {
    const [value, setValue] = useState('')

    function updateTodo(title, id, completed, sequence) {
        const newTodo = todos.map((todo) => 
            todo.id === id ? {title, id, completed, sequence} : todo
        )
        setTodos(newTodo)
        setEditTodo(null)
    }

    useEffect(() => {
        if(editTodo) {
            //setInput(editTodo.title)
        } else {
            //setInput("")
        }
    }, [editTodo])

    function submitHandler(e) {
        e.preventDefault()  // <- Отмена
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
        <form onSubmit={submitHandler}>
            <input value={value} onChange={e => setValue(e.target.value)}/>
            <button type="submit">Добавить задачу</button>
        </form>
    )
}

AddTodo.propTypes = {
    onCreate: PropTypes.func
}

export default AddTodo 