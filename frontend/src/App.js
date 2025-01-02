import React from "react";
import {Routes , Route, Navigate} from "react-router-dom"

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
				if(data.error){
					return null;  // to logout after when we fetch it will send a error if it then make it as null which makes us to redirect inot the login page
				}
				if(!res.ok){
					throw new Error(data.error || "Not authenticated")
				}
			
				return data;
			}
			catch(e){
				console.log(e);
				throw new Error(e);
			}
		},
		retry: false // nomally tanstack use 4 times to check to avoid that 

	})

	console.log(authUser)

	if(isLoading){
		return(
			<div className="flex justify-center items-center h-screen">
				<LoadingSpinner size="3xl"/> 
				{/* overriding size by lg */}


			</div>
		)
	}
	return (
		<div className="flex max-w-6xl mx-auto">
		  {authUser &&< Sidebar />}
		  <Routes>
			
			<Route
			  path="/"
			  element={ authUser?
				  <HomePage /> : 
				  <Navigate to="/login" />
				
			  }
			/>
			<Route
			  path="/signup"
			  element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
			/>
			<Route
			  path="/login"
			  element={!authUser ? <LoginPage /> : <Navigate to="/" />}
			/>
			<Route
			  path="/notifications"
			  element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
			/>
			<Route
			  path="/profile/:username"
			  element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
			/>
		  </Routes>
		  <Toaster />
		  {authUser && <RightPanel />}
		</div>
	  );
	  
}


export default App;
