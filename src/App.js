import React, {useEffect, useState} from 'react'
import TodoList from './Todo/TodoList'
import AddTodo from './Todo/AddTodo'
import Context from './context'

function App() {
  const urlTasks = 'http://185.246.66.84:3000/sdmitriev/tasks/'
  const [todos, setTodos] = useState([])
  /*  
    {id: 0, sequence: 0, completed: false, title: 'Задача 1'},
    {id: 1, sequence: 1, completed: false, title: 'Задача 2'},
    {id: 2, sequence: 2, completed: false, title: 'Задача 3'}  
  */
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
    setUpdateTasks(null)
  }, [updateTasks])  

  function removeTodo(id) {
    fetch(urlTasks + id, {
      method: 'DELETE',
    })
    .catch(err => console.log(err))
    setUpdateTasks(true)
    //setTodos(todos.filter(todo => todo.id !== id))
  }

  function addTodo(title) {
    let data = {
      title: title,
      completed: false,
      sequence: (todos.length + todosDone.length)
    }
    fetch(urlTasks, {  
      method: 'POST', 
      headers: {"Content-type": "application/json; charset=UTF-8"},
      body: JSON.stringify(data) 
    })
    .catch(err => console.log(err))
    setUpdateTasks(true)
    /*setTodos(todos.concat([{
      title: title,
      id: Date.now(),
      completed: false,
      sequence: todos.length
    }]))*/
  }

  function toggleTodo(id) {
    let cur = {}
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        todo.completed = !todo.completed
        cur = todo
      }
      return todo
    }))
    fetch(urlTasks + id, {
      method: 'PUT',
      headers: {'Content-type': 'application/json; charset=UTF-8'},
      body: JSON.stringify(cur)
      })
      .catch(err => console.log(err))
      setUpdateTasks(true)
    //removeTodo(id)
    //setTodosDone(todosDone.concat([cur]))    
  }

  function restoreTodo(id) {
    let cur = {}
    setTodosDone(todosDone.map(todo => {
      if (todo.id === id) {
        todo.completed = !todo.completed
        cur = todo
      }
      return todo
    }))
    fetch(urlTasks + id, {
      method: 'PUT',
      headers: {'Content-type': 'application/json; charset=UTF-8'},
      body: JSON.stringify(cur)
      })
      .catch(err => console.log(err))
      setUpdateTasks(true)
    //setTodosDone(todosDone.filter(todo => todo.id !== id))
    //setTodos(todos.concat([cur])) 
  }

  function handleEdit(id) {
    const findTodo = todos.find((todo) => todo.id === id)
    setEditTodo(findTodo)
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
          {todos.length ? (<TodoList todos={todos} onChange={toggleTodo} />) : (<p>Нет задач</p>)}
          <h1 className="todo-list-h1">Список завершенных задач</h1>
          {todosDone.length ? (<TodoList todos={todosDone} />) : (<p>Нет задач</p>)}   
        </div>  
    </div>
    </Context.Provider>    
  )
}

export default App