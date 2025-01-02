import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../../../constant/url.js";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullname: "",
    password: "",
  });

  //! mutation fucntion

  const {
    mutate: signup,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ email, username, fullname, password }) => {
      try {
        const res = await fetch(`${baseUrl}/api/auth/signup`, {
          //https://localhost:5000/api/auth/signup

          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, username, fullname, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to create account");
        }
        console.log(data);
        return data;
      } catch (error) {
        console.error(error.message);
        throw error;
      }
    },
    onSuccess: () => {
      console.log("user Created");
     // toast.success("user Created Successfully");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault(); // to prevent page reload while hit signup
    toast.promise(
      new Promise((resolve, reject) => {
        signup(formData, {
          onSuccess: resolve,
          onError: reject,
        });
      }),
      {
        loading: "Creating user...",
        success: "User Created Successfully",
        error: "Failed to create account",
      }
	);
//! signup(formData); 
// mutate will trigger our mutation function
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // e.target.name is the attribute that is called this function eg: email.
    //e.target.value is the value of the feild which was called this function now it is email
    //...formData "spread Operator" will fetch the all the info of the formdata and ubdate the target value
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <XSvg className=" lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">Join today.</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            {/* mail image */}
            <input
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>
          <div className="flex gap-4 flex-wrap">
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <FaUser />
              <input
                type="text"
                className="grow "
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
              />
            </label>
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <MdDriveFileRenameOutline />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                name="fullname"
                onChange={handleInputChange}
                value={formData.fullname}
              />
            </label>
          </div>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button className="btn rounded-full btn-primary text-white">
            {isPending ? "Loading.." : "Sign Up"}
          </button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-white text-lg">Already have an account?</p>

          {/* link to the login page  */}
          <Link to="/login">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
