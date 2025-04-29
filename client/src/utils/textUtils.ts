export const clipText = (text: string, maxLength: number = 12): string => {
    return text.length > maxLength ? text.slice(0, maxLength-2) + '...' : text;
};