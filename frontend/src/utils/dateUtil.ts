export const getIsoDate = (date: Date = new Date()): string => {
    console.log(`created date ${date} --- ${date.toISOString().slice(0, 19)}`);
    return date.toISOString().slice(0, 19);
};

export const formatDisplayDate = (dateIsoString: string | null | undefined): string | null => {
    if (!dateIsoString) {
        return null;
    }

    const date = new Date(dateIsoString + 'Z');
    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }

    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).format(date);
};
