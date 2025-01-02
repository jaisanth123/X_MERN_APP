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
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "./constant/url.js";
import LoadingSpinner from "./components/common/LoadingSpinner.js";


const App = ()=> {

	const {data : authUser , isLoading} = useQuery({  // this auth user have the data of the one who authenticated currently
		queryKey: ["authUser"],  // by using this querykey we can call this function from any where
		queryFn: async() =>{
			try{
				const res = await fetch(`${baseUrl}/api/auth/me`,{
					method:"GET",
					credentials: "include",
					headers:{
						"Content-Type": "application/json"
					}
				})
				const data = await res.json();
				console.log(data)
				if(!res.ok){
					const errorData = await res.json()
					throw new Error(errorData.error || "Not authenticated")
				}
				return data;
			}
			catch(e){
				console.error(e)
				throw e;
			}
		}

	})

	if(isLoading){
		return(
			<div className="flex justify-center items-center h-screen">
				<LoadingSpinner size="3xl"/> 
				{/* overriding size by lg */}


			</div>
		)
	}

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
