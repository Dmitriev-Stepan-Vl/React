import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import Context from '../context'
import TodoList from './TodoList'

function TodoItem({ todo, parentTodo, onChange }) {
    const {removeTodo} = useContext(Context)
    const {removeSubTodo} = useContext(Context)
    const {restoreTodo} = useContext(Context)
    const {restoreSubTodo} = useContext(Context)    
    const {handleEdit} = useContext(Context)
    const {handleEditSubTask} = useContext(Context)
    const {addSubTask} = useContext(Context)    
    const {toggleSubTodo} = useContext(Context)        
    
    const classes = [];
    if (todo.completed) {
        classes.push('done')
    }
    if (parentTodo) {
        classes.push('li-subtasks')
    }

    return (
        !todo.completed? (
            <li className="list-item list-item-active">
                <span className="tasks">
                    <span className={classes.join(' ')}>
                        <input
                            className="checkbox"
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => !parentTodo ? onChange(todo.id) : toggleSubTodo(parentTodo.id, todo.id)}
                        />
                        {!parentTodo ? <button className="button-add-subtask" onClick={() => addSubTask(todo.id)}>+</button> : null}
                        <span className="task-title">
                            { todo.title }
                        </span>
                    </span>
                    <span>                        
                        <button className="button-edit" onClick={() => !parentTodo ? handleEdit(todo.id) : handleEditSubTask(parentTodo.id ,todo.id)}>Редактировать</button>
                        <button className="button-delete" onClick={() => !parentTodo ? removeTodo(todo.id) : removeSubTodo(parentTodo.id ,todo.id)}>Удалить</button>
                    </span>  
                </span>                         
            {todo.subtasks || !parentTodo ? (
                <span className="subtasks">
                    <TodoList todos={todo.subTasks} parentTodo={todo} />
                </span>
            ) : null}
            </li>
        ) : (
        <li className="list-item">
            <span className="tasks">
                <span className={classes.join(' ')}>
                    <input
                        className="checkbox"
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => {return false}}      
                    />
                    <span className="task-title">
                        { todo.title }
                    </span>
                </span>
                <span>
                {!parentTodo || !parentTodo.completed ? <button className="button-restore" onClick={() => !parentTodo ? restoreTodo(todo.id) : restoreSubTodo(parentTodo.id, todo.id)}>Восстановить</button> : null}
                </span>
            </span>
            {todo.subtasks || !parentTodo ? (
                <span className="subtasks">
                    <TodoList todos={todo.subTasks} parentTodo={todo} />
                </span>
            ) : null}            
        </li>
        )        
    )
}

TodoItem.propTypes = {
    todo: PropTypes.object,
    onChange: PropTypes.func,
    parentTodo: PropTypes.object
}

export default TodoItem