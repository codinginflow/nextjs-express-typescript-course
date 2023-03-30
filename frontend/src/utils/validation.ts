import * as yup from "yup";

export const requiredStringSchema = yup.string().required("Required");

export const usernameSchema = yup.string()
    .max(20, "Must be 20 characters or less")
    .matches(/^[a-zA-Z0-9_]*$/, "Only letters, numbers, and underscores are allowed");

export const emailSchema = yup.string()
    .email("Please enter a valid email address");

export const passwordSchema = yup.string()
    .matches(/^(?!.* )/, "Must not contain any whitespaces")
    .min(6, "Must be at least 6 characters long");

export const slugSchema = yup.string()
    .matches(/^[a-zA-Z0-9_-]*$/, "No special characters or spaces allowed");

export const requiredFileSchema = yup.mixed<FileList>()
    .test(
        "not-empty-file-list",
        "Required",
        value => value instanceof FileList && value.length > 0
    )
    .required();