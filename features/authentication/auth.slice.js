import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	loggedIn: false,
	userDetails: {},
	userTheme: '',
	offlineKYCs: [],
	onlineKYCs: [],
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		login: (state) => {
			state.loggedIn = true;
		},
		logout: (state) => {
			state.loggedIn = false;
			state.userDetails = {};
		},

		updateUserDetails: (state, action) => {
			state.userDetails = action.payload;
		},
		updateTheme: (state, action) => {
			state.userTheme = action.payload;
		},
		saveKYCOffline: (state, action) => {
			state.offlineKYCs.push(action.payload);
		},

		clearOfflineKYCs: (state) => {
			state.offlineKYCs = [];
		},

		addOnlineKYC: (state, action) => {
			state.onlineKYCs.push(action.payload);
		},
		removeKYCOffline: (state, action) => {
			state.offlineKYCs = state.offlineKYCs.filter(
				(kyc) => kyc.timestamp !== action.payload
			);
		},
	},
});

export const getAuthloggedIn = (state) => state.user.loggedIn;

export const { login, logout, updateUserDetails, updateTheme, saveKYCOffline, clearOfflineKYCs, addOnlineKYC, removeKYCOffline } =
	userSlice.actions;

export default userSlice.reducer;
