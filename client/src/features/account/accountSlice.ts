import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { stat } from "fs";
import { FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import agent from "../../app/api/agent";
import { User } from "../../app/models/User";
import { setBasket } from "../basket/basketSlice";



interface AccountState {
    user: User | null,
}

const initialState: AccountState = {
    user: null
}



export const signInUser = createAsyncThunk<User, FieldValues>(
    'accoutn/signInUser',
    async (data, thunkAPI) => {
        try {
            const userDto = await agent.Account.login(data);
            const {basket, ...user} = userDto;
            if(basket) thunkAPI.dispatch(setBasket(basket));
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error })
        }
    }
)

export const fetchCurrentUser = createAsyncThunk(
    'accoutn/fetchCurrentUser',
    async (_, thunkAPI) => {
        thunkAPI.dispatch(
            setUser(JSON.parse(
                localStorage.getItem('user')!
            ))
        )
        try {
            const userDto:any = await agent.Account.currentUser();
            const {basket, ...user} = userDto;
            if(basket) thunkAPI.dispatch(setBasket(basket));
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error })
        }
    }, {
    condition: () => {
        if (!localStorage.getItem('user')) return false;
    }
}
)

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        signOut: (state) => {

            state.user = null;
            localStorage.removeItem('user')

        },
        setUser:(state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchCurrentUser.rejected,(state) => {
            state.user = null;
            localStorage.removeItem('user')
            toast.error("Session expired - please login again");
        })
        builder.addMatcher(
            isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled),
            (state: any, action) => {
                state.user = action.payload;
            }
        );
        builder.addMatcher(isAnyOf(signInUser.rejected),
            (state, action) => {
                throw action.payload
            }
        )
    })
})

export const { signOut,setUser } = accountSlice.actions;