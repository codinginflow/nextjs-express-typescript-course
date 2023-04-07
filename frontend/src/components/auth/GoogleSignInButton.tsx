import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";

export default function GoogleSignInButton() {
    const router = useRouter();

    return(
        <Button
        href={process.env.NEXT_PUBLIC_BACKEND_URL + "/users/login/google?returnTo=" + router.asPath}
        variant="light"
        className="d-flex align-items-center justify-content-center gap-1">
            <FcGoogle size={20} />
            Sign in with Google
        </Button>
    );
}