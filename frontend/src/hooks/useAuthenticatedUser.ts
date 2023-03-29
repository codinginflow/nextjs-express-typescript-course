import * as UsersApi from "@/network/api/users";
import useSWR from "swr";

export default function useAuthenticatedUser() {
    const { data, isLoading, error, mutate } = useSWR("user", UsersApi.getAuthenticatedUser);

    return {
        user: data,
        userLoading: isLoading,
        userLoadingError: error,
        mutateUser: mutate,
    }
}