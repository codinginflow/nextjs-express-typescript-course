import { useForm } from "react-hook-form";
import * as UsersApi from "@/network/api/users";
import { Button, Form, Modal } from "react-bootstrap";
import FormInputField from "../form/FormInputField";
import PasswordInputField from "../form/PasswordInputField";
import LoadingButton from "../LoadingButton";

interface LoginFormData {
    username: string,
    password: string,
}

interface LoginModalProps {
    onDismiss: () => void,
    onSignUpInsteadClicked: () => void,
    onForgotPasswordClicked: () => void,
}

export default function LoginModal({ onDismiss, onSignUpInsteadClicked, onForgotPasswordClicked }: LoginModalProps) {

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>();

    async function onSubmit(credentials: LoginFormData) {
        try {
            const user = await UsersApi.login(credentials);
            alert(JSON.stringify(user));
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <Modal show onHide={onDismiss} centered>
            <Modal.Header closeButton>
                <Modal.Title>Log In</Modal.Title>
            </Modal.Header>

            <Modal.Body>
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
                <div className="d-flex align-items-center gap-1 justify-content-center mt-1">
                   Don&apos;t have an account yet?
                    <Button variant="link">
                        Sign Up
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}