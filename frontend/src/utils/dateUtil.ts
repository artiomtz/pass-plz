export const isExpired = (isoDate: string | null): boolean => {
    if (!isoDate) {
        return false;
    }
    const localToday = new Date();
    localToday.setHours(0, 0, 0, 0);
    const target = new Date(isoDate);
    target.setHours(0, 0, 0, 0);

    return target < localToday;
};

export const getUtcIsoDate = (date: Date = new Date()): string => date.toISOString().split('.')[0];

export const toUtcIsoDate = (localDate: Date | null): string | null => {
    if (!localDate) {
        return null;
    }

    const utcDate = new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate()));

    return getUtcIsoDate(utcDate);
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

    const date = new Date(dateIsoString);
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
