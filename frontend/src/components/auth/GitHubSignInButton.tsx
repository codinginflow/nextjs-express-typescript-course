import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "react-bootstrap";
import { BsGithub } from "react-icons/bs";

export default function GitHubSignInButton() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    return (
        <Button
            href={
                process.env.NEXT_PUBLIC_BACKEND_URL + "/users/login/github?returnTo=" +
                encodeURIComponent(pathname + (searchParams?.size ? "?" + searchParams : ""))
            }
            variant="dark"
            className="d-flex align-items-center justify-content-center gap-1">
            <BsGithub size={20} />
            Sign in with GitHub
        </Button>
    );
}