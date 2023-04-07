import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
import { BsGithub } from "react-icons/bs";

export default function GitHubSignInButton() {
    const router = useRouter();

    return(
        <Button
        href={process.env.NEXT_PUBLIC_BACKEND_URL + "/users/login/github?returnTo=" + router.asPath}
        variant="dark"
        className="d-flex align-items-center justify-content-center gap-1">
            <BsGithub size={20} />
            Sign in with GitHub
        </Button>
    );
}