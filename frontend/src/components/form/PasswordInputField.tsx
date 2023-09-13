import { ComponentProps, useState } from "react";
import { Button, FormControlProps } from "react-bootstrap";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import FormInputField from "./FormInputField";

interface PasswordInputFieldProps {
    register: UseFormRegisterReturn,
    label?: string,
    error?: FieldError,
}

export default function PasswordInputField({ register, label, error, ...props }: PasswordInputFieldProps & FormControlProps & ComponentProps<"input">) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormInputField
            register={register}
            label={label}
            error={error}
            {...props}
            type={showPassword ? "text" : "password"}
            inputGroupElement={
                <Button
                    variant="secondary"
                    className="d-flex align-items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    id={register.name + "-toggle-visibility-button"}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
            }
        />
    );
}