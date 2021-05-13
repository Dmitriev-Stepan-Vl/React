import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import Context from '../context'

function TodoItem({ todo, onChange }) {
    const {removeTodo} = useContext(Context)
    const {restoreTodo} = useContext(Context)
    const {handleEdit} = useContext(Context)
    const classes = [];
    if (todo.completed) {
        classes.push('done')
    }

    return (
        !todo.completed? (
            <li className="list-item list-item-active">
                <span className={classes.join(' ')}>
                    <input
                        className="checkbox"
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => onChange(todo.id)}
                    />
                    <span className="task-title">
                        { todo.title }
                    </span>
                </span>
                <span>
                    <button className="button-edit" onClick={() => handleEdit(todo.id)}>Редактировать</button>
                    <button className="button-delete" onClick={() => removeTodo(todo.id)}>Удалить</button>
                </span>
            </li>
        ) : (
        <li className="list-item">
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
                <button className="button-restore" onClick={() => restoreTodo(todo.id)}>Восстановить</button>
            </span>
        </li>
        )
        
    )
}

TodoItem.propTypes = {
    todo: PropTypes.object,
    onChange: PropTypes.func
}

export default TodoItem