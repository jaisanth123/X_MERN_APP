import React from "react";
import {Routes , Route} from "react-router-dom"

import SignUpPage from "./pages/auth/signup/SignUpPage.js";
import LoginPage from "./pages/auth/login/LoginPage.js";
import HomePage from "./pages/home/Homepage.js";
import Sidebar from "./components/common/Sidebar.js";
import RightPanel from "./components/common/RightPanel.js";
import NotificationPage from "./pages/notification/NotificationPage.js";
import ProfilePage from "./pages/profile/ProfilePage.js";
import {Toaster} from "react-hot-toast"
function App() {
	return (
		<div className='flex max-w-6xl mx-auto'>
			<Sidebar />
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/signup' element={<SignUpPage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/notifications' element={<NotificationPage />} />
				<Route path='profile/:username' element={<ProfilePage />} />
			</Routes>
			<RightPanel />
			<Toaster />
		</div>
	);
}


export default App;
