import React from "react";
import {Routes , Route} from "react-router-dom"

import SignUpPage from "./pages/auth/signup/SignUpPage.js";
//import LoginPage from "./componests/auth/LoginPage.js";
//import SignupPage from "./componests/auth/SignupPage.js";
function App() {
	return (
		<div className='flex max-w-6xl mx-auto'>
			<Routes>
				{/* <Route path='/' element={<HomePage />} /> */}
				<Route path='/signup' element={<SignUpPage />} />
				{/*<Route path='/login' element={<LoginPage />} /> */}
			</Routes>
		</div>
	);
}


export default App;
