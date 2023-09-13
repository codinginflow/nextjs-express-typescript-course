"use client";

import LoadingButton from "@/components/LoadingButton";
import FormInputField from "@/components/form/FormInputField";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import * as UsersApi from "@/network/api/users";
import { usernameSchema } from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const validationSchema = yup.object({
    username: usernameSchema.required("Required"),
});

type OnboardingInput = yup.InferType<typeof validationSchema>;

export default function OnboardingPage() {
    const { user, mutateUser } = useAuthenticatedUser();

    const router = useRouter();
    const searchParams = useSearchParams();

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
            const returnTo = decodeURIComponent(searchParams?.get("returnTo") || "");
            router.push(returnTo || "/");
        }
    }, [user, router, searchParams]);

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