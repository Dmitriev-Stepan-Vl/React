import React, {useEffect, useState} from 'react'
import TodoList from './Todo/TodoList'
import AddTodo from './Todo/AddTodo'
import Context from './context'
import axios from 'axios'

function App() {
  const urlTasks = 'http://185.246.66.84:3000/sdmitriev/tasks/'
  const urlSubTasks = 'http://185.246.66.84:3000/sdmitriev/subtasks/'
  const [todos, setTodos] = useState([])
  /*  
    {id: 0, sequence: 0, completed: false, title: 'Задача 1'},
    {id: 1, sequence: 1, completed: false, title: 'Задача 2'},
    {id: 2, sequence: 2, completed: false, title: sss'Задача 3'}  
  */
  const [todosDone, setTodosDone] = useState([])
  const [updateTasks, setUpdateTasks] = useState(null)
  const [editTodo, setEditTodo] = useState(null)

  useEffect(() => {  
    axios.get(urlTasks)
    .then(async res => { 
          const parList = res.data;
          const myList = await Promise.all(
          parList.map(async item => {
            const subTasks = (await axios.get(urlSubTasks+'?taskId='+item.id)).data
            return {
              ...item,
              subTasks
            }
          })
          )
          setTodos(myList.filter(todo => todo.completed === false))
          setTodosDone(myList.filter(todo => todo.completed === true))
          })
    .then(setUpdateTasks(null))
    .catch(err => console.log(err))
    //
    /*fetch(urlTasks)
    .then(response => response.json())
    .then(data => {
      setTodos(data.filter(todo => todo.completed === false))
      setTodosDone(data.filter(todo => todo.completed === true))
    })    */
  }, [updateTasks])  

  function removeTodo(id) {
    const items = Array.from(todos)
    let subTasks = {}
    items.forEach(element => {
      if(element.id === id) {
        subTasks = element.subTasks
      }
    });
    if(subTasks) {
      subTasks.forEach((element, index) => {
        fetch(urlSubTasks + (index + 1), {
        method: 'DELETE',
        })
        .catch(err => console.log(err))
      });
    }
    fetch(urlTasks + id, {
      method: 'DELETE',
    })
    .then(setUpdateTasks(true))
    .catch(err => console.log(err))
  }

  function removeSubTodo(todoId ,id) {
    fetch(urlSubTasks + id, {
      method: 'DELETE',
    })
    .then(updateTodoSubTasks(todoId))
    .catch(err => console.log(err))
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
    .then(setUpdateTasks(true))
    .catch(err => console.log(err))
  }
  
  function addSubTask(id) {
    let data = {
      title: ('Подзадача ' + id),
      completed: false,
      sequence: 1,
      taskId: id
    }
    fetch(urlSubTasks, {  
      method: 'POST', 
      headers: {"Content-type": "application/json; charset=UTF-8"},
      body: JSON.stringify(data) 
    })
    .then(updateTodoSubTasks(id))
    .catch(err => console.log(err))  
  }

  function updateTodoSubTasks(id) { 
    axios.get(urlTasks)
    .then(async res => { 
          const parList = res.data;
          const myList = await Promise.all(
          parList.map(async item => {
            const subTasks = (await axios.get(urlSubTasks+'?taskId='+item.id)).data
            return {
              ...item,
              subTasks
            }
          })
          )
          myList.forEach((element) => {
            if(element.id === id) {
              fetch(urlTasks + id, {
                method: 'PUT',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                body: JSON.stringify(element)
                })
              .catch(err => console.log(err))
            }
          });          
    })
    .then(setUpdateTasks(true))
    .catch(err => console.log(err))
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
      .then(setUpdateTasks(true))
      .catch(err => console.log(err))
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
    //setTodosDone(todosDone.filter(todo => todo.id !== id))s
    //setTodos(todos.concat([cur])) 
  }

  function handleEdit(id) {
    const findTodo = todos.find((todo) => todo.id === id)
    setEditTodo(findTodo)
  }

  function handleEditSubTask(todoId, id) {
    let findTodo = {}
    todos.forEach((todo) => {
      if(todo.id === todoId) {
        todo.subTasks.forEach((curr) => {
          if(curr.id === id) {
            findTodo = curr
          }
        })
      }
    })
    setEditTodo(findTodo)
  }


  return (
    <Context.Provider value={{
      removeTodo,
      removeSubTodo,
      restoreTodo,
      handleEdit,
      handleEditSubTask,
      addSubTask
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