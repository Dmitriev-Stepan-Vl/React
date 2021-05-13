import React from 'react'
import PropTypes from 'prop-types'
import TodoItem from './TodoItem'

function TodoList({ todos, onChange }) {
    return (
        <ul className="ul">
            { todos.map((todo) => {
                return (
                    <TodoItem
                        key={todo.id}
                        todo={todo} 
                        onChange={onChange}
                    />
                )
            })}
        </ul>
    )
}

TodoList.propTypes = {
    todos: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func
}

export default TodoList