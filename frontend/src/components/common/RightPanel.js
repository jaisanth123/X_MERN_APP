import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { USERS_FOR_RIGHT_PANEL } from "../../utils/db/dummy";
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../constant/url";
import LoadingSpinner from "./LoadingSpinner";
import useFollow from "../../hooks/useFollow";

const RightPanel = () => {
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch(`${baseUrl}/api/users/suggested`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log("API Response:", data);
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data.suggestedUsers || []; // Extract the array
      } catch (e) {
        console.error("Failed to fetch suggested users", e);
        return [];
      }
    },
  });
  const {follow,isPending} = useFollow()

  if (suggestedUsers?.length === 0) return <div className='w-0 md:w-64'></div>;

  return (
    <div className="hidden mx-2 my-4 lg:block">
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        <p className="font-bold">Who to follow</p>
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          ) : suggestedUsers.length > 0 ? (
            suggestedUsers.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex items-center gap-2">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={user.profileImg || "/avatar-placeholder.png"} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullname}
                    </span>
                    <span className="text-sm text-slate-500">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className="text-black bg-white rounded-full btn hover:bg-white hover:opacity-90 btn-sm"
                    onClick={(e) =>{ e.preventDefault()
                      follow(user._id)
                    }}
                  >
                    {isPending? <LoadingSpinner/> : "Follow"}
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">No suggestions available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
