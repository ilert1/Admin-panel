export const ClearButton = ({ handleClear }: { handleClear: () => void }) => (
    <button data-testid="clear-button" onClick={handleClear}>
        clear
    </button>
);
