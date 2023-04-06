import * as UsersApi from "@/network/api/users";
import { UnauthorizedError } from "@/network/http-errors";
import useSWR from "swr";

export default function useAuthenticatedUser() {
    const { data, isLoading, error, mutate } = useSWR("authenticated_user",
        async () => {
            try {
                return await UsersApi.getAuthenticatedUser();
            } catch (error) {
                if (error instanceof UnauthorizedError) {
                    return null;
                } else {
                    throw error;
                }
            }
        }
    );

    return {
        user: data,
        userLoading: isLoading,
        userLoadingError: error,
        mutateUser: mutate,
    }
}