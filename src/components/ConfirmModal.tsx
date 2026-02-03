import {Button, Modal, Spinner} from "react-bootstrap";

// Props fürs Bestätigungs-Modal
interface ConfirmModalProps {
    show: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

// Modal das vor dem Löschen nochmal nachfragt
export function ConfirmModal({
                                 show,
                                 title,
                                 message,
                                 confirmText = "Löschen",
                                 cancelText = "Abbrechen",
                                 onConfirm,
                                 onCancel,
                                 loading = false,
                             }: ConfirmModalProps) {
    return (
        <Modal show={show} onHide={onCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel} disabled={loading}>
                    {cancelText}
                </Button>
                <Button variant="danger" onClick={onConfirm} disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner size="sm" className="me-2"/>
                            Wird gelöscht...
                        </>
                    ) : (
                        confirmText
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
