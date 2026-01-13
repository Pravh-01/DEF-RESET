import { createSlice } from "@reduxjs/toolkit";

export const navSlice = createSlice({
    name: 'navTabs',
    initialState: {
        activeTab: 'Current',
        error: null,
    },
    reducers: {
        setActiveTab(state, action) {
            state.activeTab = action.payload
        },
        setError(state, action) {
            state.error = action.payload
            state.loading = false
        },
    }
})

export const { 
    setActiveTab, 
    setError,
} = navSlice.actions;

export default navSlice.reducer;