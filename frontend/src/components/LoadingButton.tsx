import { ReactNode } from "react";
import { Button, ButtonProps, Spinner } from "react-bootstrap";

interface LoadingButtonProps {
    isLoading: boolean,
    children: ReactNode,
}

export default function LoadingButton({ isLoading, children, ...props }: LoadingButtonProps & ButtonProps) {
    return (
        <Button {...props} disabled={isLoading || props.disabled}>
            {isLoading &&
                <>
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />
                    <span className="visually-hidden">Loading...</span>
                    {" "}
                </>
            }
            {children}
        </Button>
    );
}