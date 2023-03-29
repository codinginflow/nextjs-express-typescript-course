import { ComponentProps } from "react";
import { Form, FormControlProps, InputGroup } from "react-bootstrap";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface FormInputFieldProps {
    register: UseFormRegisterReturn,
    label?: string,
    error?: FieldError,
    inputGroupElement?: JSX.Element,
}

export default function FormInputField({ register, label, error, inputGroupElement, ...props }: FormInputFieldProps & FormControlProps & ComponentProps<"input">) {
    return (
        <Form.Group className="mb-3" controlId={register.name + "-input"}>
            {label && <Form.Label>{label}</Form.Label>}
            <InputGroup hasValidation>
            <Form.Control
                {...register}
                {...props}
                isInvalid={!!error}
                aria-describedby={inputGroupElement?.props.id}
            />
            {inputGroupElement}
            <Form.Control.Feedback type="invalid">
                {error?.message}
            </Form.Control.Feedback>
            </InputGroup>
        </Form.Group>
    );
}