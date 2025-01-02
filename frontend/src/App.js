import React from "react";
import {Routes , Route} from "react-router-dom"

import SignUpPage from "./pages/auth/signup/SignUpPage.js";
import LoginPage from "./pages/auth/login/LoginPage.js";
import HomePage from "./pages/home/Homepage.js";
import Sidebar from "./components/common/Sidebar.js";
function App() {
	return (
		<div className='flex max-w-6xl mx-auto'>
			<Sidebar />
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/signup' element={<SignUpPage />} />
				<Route path='/login' element={<LoginPage />} />
			</Routes>
		</div>
	);
}


export default App;
