import React from "react";

export function useLocales() {
    const [locales, setLocales] = React.useState<string[] | null>(null);

    React.useEffect(() => {
        if (locales) {
            return;
        }

        app.getPreferredSystemLanguages().then(setLocales);
    }, [locales]);

    return locales;
}
