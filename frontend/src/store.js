import { configureStore } from '@reduxjs/toolkit'
import memoryReducer from './components/Memory/memorySlice'
import cpuReducer from './components/CPU/cpuSlice'

export const store = configureStore({
  reducer: {
    memory: memoryReducer,
    cpu: cpuReducer,
  },
})
