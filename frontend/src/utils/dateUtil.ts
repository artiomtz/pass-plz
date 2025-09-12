export const isExpired = (isoDate: string | null) => {
    if (!isoDate) return false;
    return new Date(isoDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
    // return new Date(isoDate) < new Date();
};

export const getIsoDate = (date: Date = new Date()): string => {
    console.log(`created date ${date} --- ${date.toISOString().slice(0, 19)}`);
    // return date.toISOString().slice(0, 19);
    return date.toISOString().split('.')[0];
};

export const getIsoDateFromString = (calendarDate: string | null): string | null => {
    if (!calendarDate) {
        return null;
    }
    // example input: "2025-12-02"
    const date = new Date(calendarDate);
    return getIsoDate(date);
};

export const formatDisplayDateTime = (dateIsoString: string | null | undefined): string | null => {
    if (!dateIsoString) {
        return null;
    }

    const date = new Date(dateIsoString + 'Z');
    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }

    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).format(date);
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
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
        .format(date)
        .replace(/\s/g, '-'); // ensures 15 Aug 2025 → 15-Aug-2025
};
