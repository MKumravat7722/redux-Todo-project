import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTodos, removeTodo, updateTodo } from '../features/todo/todoSlice'

function Todos() {
  const dispatch = useDispatch()
  const { todos, loading, error } = useSelector((state) => state.todo)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    dispatch(fetchTodos())
  }, [dispatch])

  const handleEdit = (id, text) => {
    setEditingId(id)
    setEditText(text)
  }

  const handleUpdate = async () => {
    if (!editText.trim()) return

    try {
      await dispatch(updateTodo({ id: editingId, text: editText })).unwrap()
      setEditingId(null)
      setEditText('')
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await dispatch(removeTodo(id)).unwrap()
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  return (
    <>
      <ul className="flex flex-col items-center">
        {loading && <p className="text-white">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {todos.map((todo) => (
          <li
            className="mt-4 flex justify-between items-center bg-zinc-800 px-4 py-2 rounded w-3/6"
            key={todo.id}
          >
            {editingId === todo.id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="text-black px-2 py-1 rounded"
              />
            ) : (
              <div className="text-white">{todo.text}</div>
            )}
            <div>
              <button
                onClick={() => handleDelete(todo.id)}
                className="text-white bg-red-500 border-0 py-1 px-4 focus:outline-none hover:bg-red-600 rounded text-md mr-2"
              >
                🗑
              </button>

              {editingId === todo.id ? (
                <button
                  onClick={handleUpdate}
                  className="py-2 px-5 bg-green-500 text-white font-semibold rounded-full shadow-md hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-400 focus:ring-opacity-75"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(todo.id, todo.text)}
                  className="py-2 px-5 bg-violet-500 text-white font-semibold rounded-full shadow-md hover:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-400 focus:ring-opacity-75"
                >
                  Edit
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default Todos
