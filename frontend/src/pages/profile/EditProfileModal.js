import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const EditProfileModal = () => {
  
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });

  const {updateProfile,isUpdatingProfile} = useUpdateUserProfile()


  const {data:authUser} = useQuery({queryKey:["authUser"]})




  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

useEffect(() =>{
  if(authUser){
    setFormData({
      fullname: authUser.fullname,
      username: authUser.username,
      email: authUser.email,
      bio: authUser.bio,
      link: authUser.link,
      newPassword: "",
      currentPassword: "",
    });
  }
},[authUser])

  return (
    <>
      <button
        className="rounded-full btn btn-outline btn-sm"
        onClick={() =>
          document.getElementById("edit_profile_modal").showModal()
        }
      >
        Edit profile
      </button>
      <dialog id="edit_profile_modal" className="modal">
        <div className="border border-gray-700 rounded-md shadow-md modal-box">
          <h3 className="my-3 text-lg font-bold">Update Profile</h3>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile(formData)
            }}
          >
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Full Name"
                className="flex-1 p-2 border border-gray-700 rounded input input-md"
                value={formData.fullname}
                name="fullname"
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Username"
                className="flex-1 p-2 border border-gray-700 rounded input input-md"
                value={formData.username}
                name="username"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 p-2 border border-gray-700 rounded input input-md"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
              />
              <textarea
                placeholder="Bio"
                className="flex-1 p-2 border border-gray-700 rounded input input-md"
                value={formData.bio}
                name="bio"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="password"
                placeholder="Current Password"
                className="flex-1 p-2 border border-gray-700 rounded input input-md"
                value={formData.currentPassword}
                name="currentPassword"
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="New Password"
                className="flex-1 p-2 border border-gray-700 rounded input input-md"
                value={formData.newPassword}
                name="newPassword"
                onChange={handleInputChange}
              />
            </div>
            <input
              type="text"
              placeholder="Link"
              className="flex-1 p-2 border border-gray-700 rounded input input-md"
              value={formData.link}
              name="link"
              onChange={handleInputChange}
            />
            <button className="text-white rounded-full btn btn-primary btn-sm">
              {isUpdatingProfile? <LoadingSpinner  size="sm"/> : "Update"}

            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="outline-none">close</button>
        </form>
      </dialog>
    </>
  );
};
export default EditProfileModal;
