module.exports = {
    env: {
        node: true,
    },
    extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended", "plugin:react-hooks/recommended"],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "unicorn"],
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2020,
    },
    rules: {
        "@typescript-eslint/no-unused-vars": [
            "warn", // or "error"
            {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_",
            },
        ],
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "unicorn/string-content": [
            "error",
            {
                patterns: {
                    "([가-힣]+)": {
                        suggest: 't("$1")',
                        message: "한글은 사용하지 않습니다.",
                        fix: false,
                    },
                },
            },
        ],
    },
};
