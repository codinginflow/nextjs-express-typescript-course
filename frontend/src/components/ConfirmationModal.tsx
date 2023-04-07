import { Button, Modal } from "react-bootstrap";
import { Variant } from "react-bootstrap/esm/types";

interface ConfirmationModalProps {
    show: boolean,
    title?: string,
    message: string,
    confirmButtonText: string,
    onConfirm: () => void,
    onCancel: () => void,
    variant?: Variant,
}

export default function ConfirmationModal({ show, title, message, confirmButtonText, onConfirm, onCancel, variant }: ConfirmationModalProps) {
    return (
        <Modal show={show} onHide={onCancel} centered>
            {title &&
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
            }
            <Modal.Body>
                {message}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={onCancel}
                    variant="outline-secondary">
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    variant={variant}>
                    {confirmButtonText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}