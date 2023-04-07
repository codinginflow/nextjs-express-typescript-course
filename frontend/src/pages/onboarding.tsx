import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { usernameSchema } from "@/utils/validation";
import { useRouter } from "next/router";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as UsersApi from "@/network/api/users";
import { Form } from "react-bootstrap";
import FormInputField from "@/components/form/FormInputField";
import LoadingButton from "@/components/LoadingButton";
import { useEffect } from "react";

const validationSchema = yup.object({
    username: usernameSchema.required("Required"),
});

type OnboardingInput = yup.InferType<typeof validationSchema>;

export default function OnboardingPage() {
    const { user, mutateUser } = useAuthenticatedUser();
    const router = useRouter();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<OnboardingInput>({
        resolver: yupResolver(validationSchema),
    });

    async function onSubmit({ username }: OnboardingInput) {
        try {
            const updatedUser = await UsersApi.updateUser({ username, displayName: username });
            mutateUser(updatedUser);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    useEffect(() => {
        if (user?.username) {
            const returnTo = router.query.returnTo?.toString();
            router.push(returnTo || "/");
        }
    }, [user, router]);

    return (
        <div>
            <h1>Onboarding</h1>
            <p>Thank you for signing up! Before you can continue, please set your username!</p>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormInputField
                    register={register("username")}
                    placeholder="Username"
                    error={errors.username}
                    maxLength={20}
                />
                <LoadingButton type="submit" isLoading={isSubmitting}>Submit</LoadingButton>
            </Form>
        </div>
    );
}