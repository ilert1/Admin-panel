export const getFilenameFromContentDisposition = (contentDisposition: string, defaultName: string): string => {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(contentDisposition);

    if (matches && matches[1]) {
        let filename = matches[1].replace(/['"]/g, "");

        try {
            filename = decodeURIComponent(filename);
        } catch (e) {
            console.warn("Failed to decode URI component", e);
        }

        return filename;
    }

    return defaultName;
};
