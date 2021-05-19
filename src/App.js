import React, {useEffect, useState} from 'react'
import TodoList from './Todo/TodoList'
import AddTodo from './Todo/AddTodo'
import Context from './context'

function App() {
  const urlTasks = 'http://185.246.66.84:3000/sdmitriev/tasks/'
   /*  
    {id: 0, sequence: 0, completed: false, title: 'Задача 1'},
    {id: 1, sequence: 1, completed: false, title: 'Задача 2'},
    {id: 2, sequence: 2, completed: false, title: 'Задача 3'}  
  */
  const [todos, setTodos] = useState([]) 
  const [todosDone, setTodosDone] = useState([])
  const [updateTasks, setUpdateTasks] = useState(null)
  const [editTodo, setEditTodo] = useState(null)

  useEffect(() => {  
    fetch(urlTasks)
    .then(response => response.json())
    .then(data => {
      setTodos(data.filter(todo => todo.completed === false))
      setTodosDone(data.filter(todo => todo.completed === true))
    })    
    .then(setUpdateTasks(null))
    .catch(err => console.log(err))
  }, [updateTasks])

  function removeTodo(id) {
    fetch(urlTasks + id, {
      method: 'DELETE',
    })
    .then(setUpdateTasks(true))
    .catch(err => console.log(err))
  }

  function addTodo(title) {
    let data = {
      title: title,
      completed: false,
      sequence: (todos.length? todos.length : 0)
    }
    fetch(urlTasks, {  
      method: 'POST', 
      headers: {"Content-type": "application/json; charset=UTF-8"},
      body: JSON.stringify(data) 
    })
    .then(setUpdateTasks(true))
    .catch(err => console.log(err))
  }

  function toggleTodo(id) {
    let cur = {}
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        todo.completed = !todo.completed
        Object.assign(cur, todo)
      }
      return todo
    }))
    fetch(urlTasks + id, {
      method: 'PUT',
      headers: {'Content-type': 'application/json; charset=UTF-8'},
      body: JSON.stringify(cur)
      })
    .then(setUpdateTasks(true)) 
    .catch(err => console.log(err))
  }

  function restoreTodo(id) {
    let cur = {}
    setTodosDone(todosDone.map(todo => {
      if (todo.id === id) {
        todo.completed = !todo.completed
        todo.sequence = (todos.length? Date.now() : 0)
        Object.assign(cur, todo)
      }
      return todo
    }))
    fetch(urlTasks + id, {
      method: 'PUT',
      headers: {'Content-type': 'application/json; charset=UTF-8'},
      body: JSON.stringify(cur)
      })
     .then(setUpdateTasks(true))
    .catch(err => console.log(err))
  }

  function handleEdit(id) {
    const findTodo = todos.find((todo) => todo.id === id)
    setEditTodo(findTodo)
  }

  function updateSequence(result) {
    const items = Array.from(todos)
    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index
    const [reorderedItem] = items.splice(sourceIndex, 1)
    items.splice(destinationIndex, 0, reorderedItem)    
    items.forEach((element, index) => {          
      console.log("i: " + index + " el.seq: " + element.sequence)  
      if(element.sequence !== index) { 
        element.sequence = index
        console.log(element.sequence)  
        fetch(urlTasks + element.id, {        
          method: 'PUT',
          headers: {'Content-type': 'application/json; charset=UTF-8'},
          body: JSON.stringify(element)
        }) 
        .catch(err => console.log(err))
      }
    });    
    setUpdateTasks(true)
  }

  return (
    <Context.Provider value={{
      removeTodo,
      restoreTodo,
      handleEdit
    }}>
      <div className="wrapper">
        <div className="todo">
          <h1>Список активных задач</h1>
          <AddTodo onCreate={addTodo} todos={todos} editTodo={editTodo} setEditTodo={setEditTodo} setUpdateTasks={setUpdateTasks}/>
      </div>
        <div className="todo-list">
          {todos.length ? (<TodoList todos={todos} onChange={toggleTodo} updateSequence={updateSequence} />) : (<p>Нет задач</p>)}
          <h1 className="todo-list-h1">Список завершенных задач</h1>
          {todosDone.length ? (<TodoList todos={todosDone} updateSequence={updateSequence} />) : (<p>Нет задач</p>)}   
        </div>  
    </div>
    </Context.Provider>    
  )
}

export default App