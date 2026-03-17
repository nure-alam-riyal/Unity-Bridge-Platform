import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    role: '',
    NIDorBRITH: '',
    LicenseNumber: '',
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData: (state, action) => {
            state.role = action.payload.role;
            state.NIDorBRITH = action.payload.NIDorBRITH;
            state.LicenseNumber = action.payload.LicenseNumber;
        },
    },
})

export const { setUserData } = userSlice.actions;

export default userSlice.reducer;