import { configureStore } from "@reduxjs/toolkit";
import navReducer from "./features/navSlice";
import tasks from "./features/tasksSlice";

export const store = configureStore({
    reducer: {
        nav: navReducer,
        tasks: tasks,
    }
})