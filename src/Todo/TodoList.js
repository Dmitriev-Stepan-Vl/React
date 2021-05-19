import React from 'react'
import PropTypes from 'prop-types'
import TodoItem from './TodoItem'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function TodoList({ todos, onChange, updateSequence }) {

    function onDragEnd(result) {        
        if (!result.destination) {
            return        
        }
        if (result.destination.index === result.source.index) {
            return
        }
        updateSequence(result)
    }

    const sortTask = (a, b) => {
        if (a.sequence > b.sequence) {
            return 1
        } else return -1
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="ul">
                {(provided) => (
                    <ul className="ul" {...provided.droppableProps} ref={provided.innerRef}>
                    {todos.sort(sortTask).map((todo, index) => (
                            <Draggable key={todo.id} draggableId={"id" + todo.id} index={index}>
                                {(provided) => (
                                    <div 
                                        ref={provided.innerRef} 
                                        {...provided.draggableProps} 
                                        {...provided.dragHandleProps}
                                    >
                                        <TodoItem                                    
                                            key={todo.id}
                                            index={index}
                                            todo={todo} 
                                            onChange={onChange}
                                        />
                                    </div>
                                )}
                            </Draggable>       
                    ))}
                    {provided.placeholder}
                </ul>
                )}
            </Droppable>            
        </DragDropContext>        
    )
}

TodoList.propTypes = {
    todos: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func
}

export default TodoList