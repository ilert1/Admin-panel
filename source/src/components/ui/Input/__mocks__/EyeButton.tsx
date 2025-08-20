export const EyeButton = ({
    setShowPassword,
    showPassword
}: {
    setShowPassword: (value: boolean) => void;
    showPassword: boolean;
}) => (
    <button data-testid="eye-button" onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? "hide" : "show"}
    </button>
);
