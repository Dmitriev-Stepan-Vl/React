import React from 'react'
import PropTypes from 'prop-types'
import TodoItem from './TodoItem'

function TodoList({ todos, parentTodo, onChange  }) {
    return (
        <ul className="ul">
            { todos.map((todo) => {
                return (
                    <TodoItem
                        key={todo.id}
                        todo={todo} 
                        onChange={onChange}
                        parentTodo={parentTodo}
                    />
                )
            })}
        </ul>
    )
}

TodoList.propTypes = {
    todos: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func,
    parentTodo: PropTypes.object
}

export default TodoList