export const clipText = (text: string, maxLength: number = 12): string => {
    if(text.length <= 0) return '';
    return text.length > maxLength ? text.slice(0, maxLength-2) + '...' : text;
};