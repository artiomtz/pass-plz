export const isExpired = (isoDate: string | null): boolean => {
    if (!isoDate) {
        return false;
    }

    return new Date(isoDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
};

export const getIsoDate = (date: Date = new Date()): string => {
    return date.toISOString().split('.')[0];
};

export const getIsoDateFromString = (calendarDate: string | null): string | null => {
    if (!calendarDate) {
        return null;
    }

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
        hour: 'numeric',
        hour12: true,
        minute: '2-digit',
        month: 'short',
        year: 'numeric',
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
        .replace(/\s/g, '-');
};
