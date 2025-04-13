import { useState, useEffect } from 'react'
import './App.css'

interface Todo {
  description: string
  completed: boolean
  completedDate?: string
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [todoDescription, setTodoDescription] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('todos')
    if (saved) {
      setTodos(JSON.parse(saved))
    }
    
  }, [])

  const saveToLocalStorage = (todos: Todo[]) => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoDescription(e.target.value)
  }

  const handleAddOrUpdate = () => {
    if (todoDescription.trim() === '') return

    if (editingIndex !== null) {

      // Editar
      const updated = [...todos]
      updated[editingIndex].description = todoDescription
      setTodos(updated)
      saveToLocalStorage(updated)
      setEditingIndex(null)
    } else {
      
      // Agregar
      const newTodo: Todo = {
        description: todoDescription,
        completed: false,
      }
      const updated = [newTodo, ...todos]
      setTodos(updated)
      saveToLocalStorage(updated)
    }

    setTodoDescription('')
  }

  const handleToggle = (index: number) => {
    const updated = [...todos]
    const todo = updated[index]
    todo.completed = !todo.completed
    todo.completedDate = todo.completed ? new Date().toLocaleString() : undefined

    updated.splice(index, 1)
    todo.completed ? updated.push(todo) : updated.unshift(todo)

    setTodos(updated)
    saveToLocalStorage(updated)
  }

  const handleDelete = (index: number) => {
    const updated = todos.filter((_, i) => i !== index)
    setTodos(updated)
    saveToLocalStorage(updated)
  }

  const startEditing = (index: number) => {
    setEditingIndex(index)
    setTodoDescription(todos[index].description)
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setTodoDescription('')
  }

  return (
    <div style={{ border: '1px solid blue', padding: 20, maxWidth: 500, margin: '0 auto' }}>
      <h2>TODOs here:</h2>

      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          value={todoDescription}
          onChange={handleChange}
          style={{ marginRight: 10 }}
        />
        <button onClick={handleAddOrUpdate}>
          {editingIndex !== null ? 'Actualizar' : 'Agregar'}
        </button>
        {editingIndex !== null && (
          <button onClick={cancelEdit} style={{ marginLeft: 8 }}>
            Cancelar
          </button>
        )}
      </div>

      <ul>
        {todos.map((todo, index) => (
          <li
            key={index}
            style={{
              color: todo.completed ? 'red' : 'black',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <div style={{ flexGrow: 1 }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(index)}
                style={{ marginRight: 8 }}
              />

              {todo.description}
              {todo.completed && (
                <span style={{ marginLeft: 10, fontSize: '0.8em' }}>
                  (Completado el {todo.completedDate})
                </span>
              )}
            </div>

            <button onClick={() => startEditing(index)} style={{ marginLeft: 5 }}>
              Editar
            </button>

            <button onClick={() => handleDelete(index)} style={{ marginLeft: 5 }}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
