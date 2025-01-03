import toast from "react-hot-toast"
import { baseUrl } from "../constant/url";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useFollow =() =>{

    const queryClient = useQueryClient()
    const{mutate: follow , isPending} = useMutation({
        mutationFn: async(userId) =>{
            try{
                const res = await fetch(`${baseUrl}/api/users/follow/${userId}`,{
                    method:"POST",
                    credentials:"include",
                    headers:{
                        "Content-Type":"application/json",
                    }
                })
                const data = await res.json();
                if(!res.ok){
                    throw new Error(data.error || "Something went wrong")
                }
                return data

            }
            catch(e){
                throw e
            }
        },
        onSuccess:()=>{
            Promise.all([
            queryClient.invalidateQueries({queryKey:["suggestedUsers"]}), // to follow from the suggested users 
            queryClient.invalidateQueries({queryKey:["authUser"]}) // to follow inside their profile 
            ])// to make them to do parallel
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
    return {follow, isPending}

}
export default useFollow;