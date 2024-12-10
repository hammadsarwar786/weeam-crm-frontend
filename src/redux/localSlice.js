import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: JSON.parse(window.localStorage.getItem('user')),
    tree: null,
    users:null
};

const localSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            // You can also update localStorage here if needed
        },
        clearUser: (state) => {
            state.user = null;
            // You can also update localStorage here if needed
        },
        setTree: (state, action) => {
            state.tree = action.payload; 
        },
        setUsers:(state,action)=>{
            state.users = action?.payload
        }
    },
});

export const { setUser, clearUser, setTree,setUsers } = localSlice.actions;

export default localSlice.reducer;