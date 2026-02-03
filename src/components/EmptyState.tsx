interface EmptyStateProps {
    message: string;
    colSpan?: number;
}

// Anzeige wenn keine Daten vorhanden
export function EmptyState({message, colSpan}: EmptyStateProps) {
    if (colSpan) {
        return (
            <tr>
                <td colSpan={colSpan} className="text-center text-muted py-4">
                    {message}
                </td>
            </tr>
        );
    }

    return (
        <div className="text-center text-muted py-4">
            {message}
        </div>
    );
}
