import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import Context from '../context'

const styles = {
    li: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5px 1px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        marginBottom: '0.5px'
    },
    input: {
        marginRight: '5px'
    }
}

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
            <li style={styles.li}>
                <span className={classes.join(' ')}>
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        style={styles.input}
                        onChange={() => onChange(todo.id)}
                    />
                    { todo.title }
                </span>
                <span>
                    <button className="" onClick={() => handleEdit(todo.id)}>Редактировать</button>
                    <button className="button-delete" onClick={() => removeTodo(todo.id)}>Удалить</button>
                </span>
            </li>
        ) : (
        <li style={styles.li}>
            <span className={classes.join(' ')}>
                <input
                    type="checkbox"
                    checked={todo.completed}
                    style={styles.input} 
                    onChange={() => {return false}}      
                />
                { todo.title }
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