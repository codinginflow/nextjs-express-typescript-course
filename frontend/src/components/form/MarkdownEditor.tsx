import dynamic from 'next/dynamic';
import { Form } from 'react-bootstrap';
import { FieldError, UseFormRegisterReturn, UseFormSetValue, UseFormWatch } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import * as BlogApi from "@/network/api/blog";
import Markdown from '../Markdown';

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
    ssr: false,
});

interface MarkdownEditorProps {
    register: UseFormRegisterReturn,
    watch: UseFormWatch<any>,
    setValue: UseFormSetValue<any>,
    label?: string,
    error?: FieldError,
    editorHeight?: number,
}

export default function MarkdownEditor({ register, watch, setValue, label, error, editorHeight = 500 }: MarkdownEditorProps) {

    async function uploadInPostImage(image: File) {
        try {
            const response = await BlogApi.uploadInPostImage(image);
            return response.imageUrl;
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <Form.Group className="mb-3">
            {label && <Form.Label htmlFor={register.name + "-input_md"}>{label}</Form.Label>}
            <MdEditor
                {...register}
                id={register.name + "-input"}
                renderHTML={text => <Markdown>{text}</Markdown>}
                value={watch(register.name)}
                onChange={({ text }) => setValue(register.name, text, {shouldValidate: true, shouldDirty: true})}
                placeholder="Write something..."
                className={error ? "is-invalid" : ""}
                style={{height: editorHeight}}
                onImageUpload={uploadInPostImage}
                imageAccept=".jpg,.png"
            />
            <Form.Control.Feedback type="invalid">
                {error?.message}
            </Form.Control.Feedback>
        </Form.Group>
    );
}