import {useEffect} from "react";
import {Alert} from "react-bootstrap";

interface FeedbackAlertProps {
    type: "success" | "danger";
    message: string;
    onClose: () => void;
    autoClose?: boolean;
    autoCloseDelay?: number;
}

// Alert der nach ein paar Sekunden automatisch verschwindet
export function FeedbackAlert({
                                  type,
                                  message,
                                  onClose,
                                  autoClose = true,
                                  autoCloseDelay = 3000,
                              }: FeedbackAlertProps) {
    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(onClose, autoCloseDelay);
            return () => clearTimeout(timer);
        }
    }, [autoClose, autoCloseDelay, onClose]);

    return (
        <Alert variant={type} onClose={onClose} dismissible className="mb-3">
            {message}
        </Alert>
    );
}
