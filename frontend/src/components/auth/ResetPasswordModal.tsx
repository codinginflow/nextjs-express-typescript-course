import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import useCountdown from "@/hooks/useCountdown";
import { BadRequestError, ConflictError, NotFoundError } from "@/network/http-errors";
import { emailSchema, passwordSchema, requiredStringSchema } from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import * as UsersApi from "@/network/api/users";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import FormInputField from "../form/FormInputField";
import PasswordInputField from "../form/PasswordInputField";
import LoadingButton from "../LoadingButton";
import SocialSignInSection from "./SocialSignInSection";

const validationSchema = yup.object({
    email: emailSchema.required("Required"),
    password: passwordSchema.required("Required"),
    verificationCode: requiredStringSchema,
});

type ResetPasswordFormData = yup.InferType<typeof validationSchema>;

interface ResetPasswordModalProps {
    onDismiss: () => void,
    onSignUpClicked: () => void,
}

export default function ResetPasswordModal({ onDismiss, onSignUpClicked }: ResetPasswordModalProps) {
    const { mutateUser } = useAuthenticatedUser();

    const [verificationCodeRequestPending, setVerificationCodeRequestPending] = useState(false);
    const [showVerificationCodeSentText, setShowVerificationCodeSentText] = useState(false);
    const { secondsLeft: verificationCodeCooldownSecondsLeft, start: startVerificationCodeCooldown } = useCountdown();

    const [errorText, setErrorText] = useState<string | null>(null);

    const { register, handleSubmit, getValues, trigger, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormData>({
        resolver: yupResolver(validationSchema),
    });

    async function onSubmit(credentials: ResetPasswordFormData) {
        try {
            setErrorText(null);
            setShowVerificationCodeSentText(false);
            const user = await UsersApi.resetPassword(credentials);
            mutateUser(user);
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
            await UsersApi.requestPasswordResetCode(emailInput);
            setShowVerificationCodeSentText(true);
            startVerificationCodeCooldown(60);
        } catch (error) {
            if (error instanceof NotFoundError) {
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
                <Modal.Title>Reset Password</Modal.Title>
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
                        register={register("email")}
                        type="email"
                        label="Email"
                        placeholder="Email"
                        error={errors.email}
                    />
                    <PasswordInputField
                        register={register("password")}
                        label="New password"
                        placeholder="New password"
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
                        Log In
                    </LoadingButton>
                </Form>
                <div className="d-flex align-items-center gap-1 justify-content-center mt-1">
                    Don&apos;t have an account yet?
                    <Button variant="link" onClick={onSignUpClicked}>
                        Sign Up
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}