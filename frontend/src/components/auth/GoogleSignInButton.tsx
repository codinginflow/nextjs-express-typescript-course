import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";

export default function GoogleSignInButton() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    return (
        <Button
            href={
                process.env.NEXT_PUBLIC_BACKEND_URL + "/users/login/google?returnTo=" +
                encodeURIComponent(pathname + (searchParams?.size ? "?" + searchParams : ""))
            }
            variant="light"
            className="d-flex align-items-center justify-content-center gap-1">
            <FcGoogle size={20} />
            Sign in with Google
        </Button>
    );
}