import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { baseUrl } from '../constant/url'
import toast from 'react-hot-toast'
const useUpdateUserProfile = () => {
    const queryClient = useQueryClient()
    const {mutate:updateProfile , isPending : isUpdatingProfile} = useMutation({
        mutationFn: async (formData) => {
          try {
    
            const res = await fetch(`${baseUrl}/api/users/update`, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            })
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "something went wrong");
            return data;
    
      }
      catch(err){
        throw err;
      }},
      onSuccess:()=>{
        toast.success("profile updated successfully")
        Promise.all([
            queryClient.invalidateQueries({queryKey:["authUser"]}),
            queryClient.invalidateQueries({queryKey:["userProfile"]})
    
        ])
      },
      onError: (err) => {
        toast.error(err.message);
      },
    })
    return {updateProfile, isUpdatingProfile}
}

export default useUpdateUserProfile