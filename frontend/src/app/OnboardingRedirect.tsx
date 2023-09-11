"use client";

import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function OnboardingRedirect() {

    const { user } = useAuthenticatedUser();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (user && !user.username && pathname !== "/onboarding") {
            router.push("/onboarding?returnTo=" +
                encodeURIComponent(
                    pathname + (searchParams?.size ? "?" + searchParams : "")
                )
            );
        }
    }, [user, router, pathname, searchParams]);

    return null;
}