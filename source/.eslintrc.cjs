module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier"
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    env: {
        browser: true,
        es2021: true
    },
    settings: {
        react: {
            version: "detect"
        }
    },
    rules: {
        "no-undef": "off",
        "no-unused-vars": "off",
        "eslint no-empty": "off",
        "react/prop-types": "off",
        "@typescript-eslint/no-unused-vars": ["error"],
        "@typescript-eslint/no-empty-function": "off"
    }
};
