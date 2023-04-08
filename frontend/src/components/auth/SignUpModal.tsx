import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as UsersApi from "@/network/api/users";
import FormInputField from "../form/FormInputField";
import PasswordInputField from "../form/PasswordInputField";
import LoadingButton from "../LoadingButton";
import { AxiosError } from "axios";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { useState } from "react";
import { BadRequestError, ConflictError } from "@/network/http-errors";
import * as yup from "yup";
import { emailSchema, passwordSchema, requiredStringSchema, usernameSchema } from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import SocialSignInSection from "./SocialSignInSection";
import useCountdown from "@/hooks/useCountdown";

const validationSchema = yup.object({
    username: usernameSchema.required("Required"),
    email: emailSchema.required("Required"),
    password: passwordSchema.required("Required"),
    verificationCode: requiredStringSchema,
});

type SignUpFormData = yup.InferType<typeof validationSchema>;

interface SignUpModalProps {
    onDismiss: () => void,
    onLoginInsteadClicked: () => void,
}

export default function SignUpModal({ onDismiss, onLoginInsteadClicked }: SignUpModalProps) {
    const { mutateUser } = useAuthenticatedUser();

    const [verificationCodeRequestPending, setVerificationCodeRequestPending] = useState(false);
    const [showVerificationCodeSentText, setShowVerificationCodeSentText] = useState(false);
    const { secondsLeft: verificationCodeCooldownSecondsLeft, start: startVerificationCodeCooldown } = useCountdown();

    const [errorText, setErrorText] = useState<string | null>(null);

    const { register, handleSubmit, getValues, trigger, formState: { errors, isSubmitting } } = useForm<SignUpFormData>({
        resolver: yupResolver(validationSchema),
    });

    async function onSubmit(credentials: SignUpFormData) {
        try {
            setErrorText(null);
            setShowVerificationCodeSentText(false);
            const newUser = await UsersApi.signUp(credentials);
            mutateUser(newUser);
            onDismiss();
        } catch (error) {
            if (error instanceof ConflictError || error instanceof BadRequestError) {
                setErrorText(error.message);
            } else {
                console.error(error);
                alert(error);
            }
        }
    }

    async function requestVerificationCode() {
        const validEmailInput = await trigger("email");
        if (!validEmailInput) return;
        const emailInput = getValues("email");
        setErrorText(null);
        setShowVerificationCodeSentText(false);
        setVerificationCodeRequestPending(true);

        try {
            await UsersApi.requestEmailVerificationCode(emailInput);
            setShowVerificationCodeSentText(true);
            startVerificationCodeCooldown(60);
        } catch (error) {
            if (error instanceof ConflictError) {
                setErrorText(error.message);
            } else {
                console.error(error);
                alert(error);
            }
        } finally {
            setVerificationCodeRequestPending(false);
        }
    }

    return (
        <Modal show onHide={onDismiss} centered>
            <Modal.Header closeButton>
                <Modal.Title>Sign Up</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {errorText &&
                    <Alert variant="danger">{errorText}</Alert>
                }
                {showVerificationCodeSentText &&
                    <Alert variant="warning">
                        We sent you a verification code. Please check your inbox!
                    </Alert>
                }
                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <FormInputField
                        register={register("username")}
                        label="Username"
                        placeholder="Username"
                        error={errors.username}
                    />
                    <FormInputField
                        register={register("email")}
                        type="email"
                        label="Email"
                        placeholder="Email"
                        error={errors.email}
                    />
                    <PasswordInputField
                        register={register("password")}
                        label="Password"
                        placeholder="Password"
                        error={errors.password}
                    />
                    <FormInputField
                        register={register("verificationCode")}
                        label="Verification code"
                        placeholder="Verification code"
                        type="number"
                        error={errors.verificationCode}
                        inputGroupElement={
                            <Button
                                id="button-send-verification-code"
                                disabled={verificationCodeRequestPending || verificationCodeCooldownSecondsLeft > 0}
                                onClick={requestVerificationCode}>
                                Send code
                                {verificationCodeCooldownSecondsLeft > 0 && `(${verificationCodeCooldownSecondsLeft})`}
                            </Button>
                        }
                    />
                    <LoadingButton
                        type="submit"
                        isLoading={isSubmitting}
                        className="w-100">
                        Sign Up
                    </LoadingButton>
                </Form>
                <hr />
                <SocialSignInSection />
                <div className="d-flex align-items-center gap-1 justify-content-center mt-1">
                    Already have an account?
                    <Button variant="link" onClick={onLoginInsteadClicked}>
                        Log In
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}