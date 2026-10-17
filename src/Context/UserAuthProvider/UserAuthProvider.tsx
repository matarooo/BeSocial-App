import { createContext, useCallback, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserAuthContextType, UserData } from "./userAuthProvider.interface";
import { getUserData } from "./userAuthProvider.services";

export const userDataQueryKey = ["userData"] as const;

export const UserAuthContext =  createContext<UserAuthContextType>({
    userData: null,
    setUserData: () => {}
})

export default function UserAuthProvider({children}:{children: React.ReactNode}) {
    const queryClient = useQueryClient();
    const { data: userData = null } = useQuery({
        queryKey: userDataQueryKey,
        queryFn: getUserData,
        retry: false,
    });
    const setUserData = useCallback<React.Dispatch<React.SetStateAction<UserData | null>>>(
        (nextUserData) => {
            queryClient.setQueryData<UserData | null>(userDataQueryKey, (currentUserData) =>
                typeof nextUserData === "function"
                    ? nextUserData(currentUserData ?? null)
                    : nextUserData
            );
        },
        [queryClient]
    );

    return <UserAuthContext.Provider value={{userData, setUserData}}>
        {children}
    </UserAuthContext.Provider>
}