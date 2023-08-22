import os from "os";

jest.mock("electron", () => ({
    app: {
        getPreferredSystemLanguages: () => ["en-US"],
    },
}));

jest.mock("@async3619/merry-go-round", () => ({
    getMusicsPath: () => os.homedir(),
}));

jest.mock("fast-glob", () => ({
    glob: () => ["./test.mp3"],
}));

jest.mock("music-metadata", () => ({
    parseFile: () => ({
        common: {
            title: "title",
            artist: "artist",
            artists: ["artists"],
            album: "album",
            albumartist: "albumartist",
            genre: ["genre"],
            year: 2021,
            track: { no: 1 },
            disk: { no: 1 },
        },
        format: {
            duration: 1000,
        },
    }),
}));
