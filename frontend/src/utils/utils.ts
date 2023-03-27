import format from "date-fns/format";

export function generateSlug(input: string) {
    return input
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .trim()
        .replace(/ +/g, " ") // merge multiple spaces in a row
        .replace(/\s/g, "-")
        .toLowerCase();
}

export function formatDate(dateString: string) {
    return format(new Date(dateString), "MMM d, yyyy");
}