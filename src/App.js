import React, {useState} from 'react'
import TodoList from './Todo/TodoList'
import AddTodo from './Todo/AddTodo'
import Context from './context'

function App() {
  const [todos, setTodos] = useState([
    {id: 0, sequence: 0, completed: false, title: 'Задача 1'},
    {id: 1, sequence: 1, completed: false, title: 'Задача 2'},
    {id: 2, sequence: 2, completed: false, title: 'Задача 3'}
  ])
  const [todosDone, setTodosDone] = useState([])
  const [editTodo, setEditTodo] = useState(null)

  function toggleTodo(id) {
    let cur = {}
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        todo.completed = !todo.completed
        cur = todo
      }
      return todo
    }))
    removeTodo(id)
    setTodosDone(todosDone.concat([cur]))    
  }

  function removeTodo(id) {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  function addTodo(title) {
    setTodos(todos.concat([{
      title,
      id: Date.now(),
      completed: false,
      sequence: todos.length
    }]))
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
    setTodosDone(todosDone.filter(todo => todo.id !== id))
    setTodos(todos.concat([cur])) 
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
      <h1>Список активных задач</h1>
      <AddTodo onCreate={addTodo} todos={todos} setTodos={setTodos} editTodo={editTodo} setEditTodo={setEditTodo}/>
      {todos.length ? (<TodoList todos={todos} onChange={toggleTodo} />) : (<p>Нет задач</p>)}
      <h1>Список завершенных задач</h1>
      {todosDone.length ? (<TodoList todos={todosDone} />) : (<p>Нет задач</p>)}     
    </div>
    </Context.Provider>    
  )
}

export default App