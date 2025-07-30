import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../api'

// Async Thunks

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const res = await API.get('/todos')
  return res.data
})

export const addTodo = createAsyncThunk('todos/addTodo', async (text) => {
  const res = await API.post('/todos', { todo: { text } })
  return res.data
})

export const removeTodo = createAsyncThunk('todos/removeTodo', async (id) => {
  await API.delete(`/todos/${id}`)
  return id
})

export const updateTodo = createAsyncThunk('todos/updateTodo', async ({ id, text }) => {
  const res = await API.put(`/todos/${id}`, { todo: { text } })
  return res.data
})

// Slice

const todoSlice = createSlice({
  name: 'todo',
  initialState: {
    todos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false
        state.todos = action.payload
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // Add
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.unshift(action.payload)
      })

      // Remove
      .addCase(removeTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload)
      })

      // Update
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex((t) => t.id === action.payload.id)
        if (index !== -1) {
          state.todos[index] = action.payload
        }
      })
  },
})

export default todoSlice.reducer
