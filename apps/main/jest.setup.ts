jest.mock("electron", () => ({
    app: {
        getPreferredSystemLanguages: () => ["en-US"],
    },
}));
