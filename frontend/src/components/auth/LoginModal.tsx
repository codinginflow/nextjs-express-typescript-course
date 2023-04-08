import { useForm } from "react-hook-form";
import * as UsersApi from "@/network/api/users";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import FormInputField from "../form/FormInputField";
import PasswordInputField from "../form/PasswordInputField";
import LoadingButton from "../LoadingButton";
import { useState } from "react";
import { TooManyRequestsError, UnauthorizedError } from "@/network/http-errors";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { requiredStringSchema } from "@/utils/validation";
import SocialSignInSection from "./SocialSignInSection";

const validationSchema = yup.object({
    username: requiredStringSchema,
    password: requiredStringSchema,
});

type LoginFormData = yup.InferType<typeof validationSchema>;

interface LoginModalProps {
    onDismiss: () => void,
    onSignUpInsteadClicked: () => void,
    onForgotPasswordClicked: () => void,
}

export default function LoginModal({ onDismiss, onSignUpInsteadClicked, onForgotPasswordClicked }: LoginModalProps) {
    const { mutateUser } = useAuthenticatedUser();

    const [errorText, setErrorText] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
        resolver: yupResolver(validationSchema),
    });

    async function onSubmit(credentials: LoginFormData) {
        try {
            setErrorText(null);
            const user = await UsersApi.login(credentials);
            mutateUser(user);
            onDismiss();
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                setErrorText("Invalid credentials");
            } else if (error instanceof TooManyRequestsError) {
                setErrorText("You're trying too often");
            } else {
                console.error(error);
                alert(error);
            }
        }
    }

    return (
        <Modal show onHide={onDismiss} centered>
            <Modal.Header closeButton>
                <Modal.Title>Log In</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {errorText &&
                    <Alert variant="danger">{errorText}</Alert>
                }
                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <FormInputField
                        register={register("username")}
                        label="Username"
                        placeholder="Username"
                        error={errors.username}
                    />
                    <PasswordInputField
                        register={register("password")}
                        label="Password"
                        placeholder="Password"
                        error={errors.password}
                    />
                    <Button
                        variant="link"
                        className="d-block ms-auto mt-n3 mb-3 small"
                        onClick={onForgotPasswordClicked}>
                        Forgot password?
                    </Button>
                    <LoadingButton
                        type="submit"
                        isLoading={isSubmitting}
                        className="w-100">
                        Log In
                    </LoadingButton>
                </Form>
                <hr />
                <SocialSignInSection />
                <div className="d-flex align-items-center gap-1 justify-content-center mt-1">
                    Don&apos;t have an account yet?
                    <Button variant="link" onClick={onSignUpInsteadClicked}>
                        Sign Up
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}