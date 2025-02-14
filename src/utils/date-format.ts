import { formatInTimeZone } from 'date-fns-tz'

export const getTimeZone = (timezone: string, date: Date) => {
    const timeZone = formatInTimeZone(date, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
    const startOfDay = formatInTimeZone(date, timezone, "yyyy-MM-dd'T'00:00:00XXX");
    const endOfDay = formatInTimeZone(date, timezone, "yyyy-MM-dd'T'23:59:59XXX");
    return {
        timeZone: timeZone,
        startOfDay: startOfDay,
        endOfDay: endOfDay
    }
}