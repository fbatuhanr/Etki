import { SelectionType } from "@/src/components/modal/CalendarModal";

export const dateFormatter = (date?: Date): string => date?.toLocaleDateString() || '';

export const isToday = (selectedDate?: Date): boolean => {
    if (!selectedDate) return false;

    const today = new Date();
    return (
        selectedDate.getFullYear() === today.getFullYear() &&
        selectedDate.getMonth() === today.getMonth() &&
        selectedDate.getDate() === today.getDate()
    );
};
export const isTomorrow = (selectedDate?: Date): boolean => {
    if (!selectedDate) return false;

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    return (
        selectedDate.getFullYear() === tomorrow.getFullYear() &&
        selectedDate.getMonth() === tomorrow.getMonth() &&
        selectedDate.getDate() === tomorrow.getDate()
    );
};
export const getDaysAgo = (selectedDate?: Date, days: number = 0): Date => {
    if (!selectedDate) return new Date();
    const daysAgo = new Date(selectedDate);
    daysAgo.setDate(selectedDate.getDate() - days);
    return daysAgo;
};
export const getYesterday = (selectedDate?: Date): Date => {
    if (!selectedDate) return new Date();
    const yesterday = new Date(selectedDate);
    yesterday.setDate(selectedDate.getDate() - 1);
    return yesterday;
};
export const getTomorrow = (selectedDate?: Date): Date => {
    if (!selectedDate) return new Date();
    const tomorrow = new Date(selectedDate);
    tomorrow.setDate(selectedDate.getDate() + 1);
    return tomorrow;
};
export const getDayName = (date?: Date, locale: string = 'en-US'): string => {
    if (!date) return '';
    return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
};
export const getShortDay = (date?: Date): string => {
    if (!date) return '';
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
};
export const getDateRange = (
    type: SelectionType,
    customDate?: Date
): { label: string, start: Date, end: Date } => {
    const { Today, Tomorrow, ThisWeek, NextWeek, Custom } = SelectionType;
    const today = new Date();
    switch (type) {
        case Today:
            return { label: Today, start: today, end: today };
        case Tomorrow:
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            return { label: Tomorrow, start: tomorrow, end: tomorrow };
        case ThisWeek:
            const endOfThisWeek = new Date(today);
            endOfThisWeek.setDate(today.getDate() + (7 - today.getDay()));
            endOfThisWeek.setHours(23, 59, 59, 999);
            return { label: ThisWeek, start: today, end: endOfThisWeek };
        case NextWeek:
            const endOfThisWeekForNext = new Date(today);
            endOfThisWeekForNext.setDate(today.getDate() + (7 - today.getDay()));
            endOfThisWeekForNext.setHours(23, 59, 59, 999);
            const startOfNextWeek = new Date(endOfThisWeekForNext);
            startOfNextWeek.setDate(endOfThisWeekForNext.getDate() + 1);
            startOfNextWeek.setHours(0, 0, 0, 0);
            const endOfNextWeek = new Date(startOfNextWeek);
            endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
            endOfNextWeek.setHours(23, 59, 59, 999);
            return { label: NextWeek, start: startOfNextWeek, end: endOfNextWeek };
        case Custom:
            if (customDate) {
                if (isToday(customDate)) return getDateRange(Today);
                if (isTomorrow(customDate)) return getDateRange(Tomorrow);
                return { label: getShortDay(customDate), start: customDate, end: customDate };
            }
            break;
    }
    throw new Error('Invalid type or missing custom date');
};
export const isDateLabelCustom = (label?: string): boolean => {
    if (!label) return false;
    const predefinedLabels = (Object.values(SelectionType) as string[]).filter((value) => value !== SelectionType.Custom);

    return !predefinedLabels.includes(label);
};

export const formatDate = (date: Date): string => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'long' }).toUpperCase();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day} ${month} ${hours}:${minutes}`; // 30 DECEMBER 18:00
};

export function formatToDayAndTimePeriod(date: Date): string {
    const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const hours = date.getHours();

    let timePeriod = "";
    if (hours >= 5 && hours < 12) {
        timePeriod = "MORNING";
    } else if (hours >= 12 && hours < 17) {
        timePeriod = "AFTERNOON";
    } else if (hours >= 17 && hours < 21) {
        timePeriod = "EVENING";
    } else {
        timePeriod = "NIGHT";
    }

    const dayName = days[date.getDay()];
    return `${dayName} ${timePeriod}`;  // SUNDAY EVENING
}
