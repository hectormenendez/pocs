const TYPE_LITERAL = "literal";

export const FORMAT_2DIGIT = "2-digit";
export const FORMAT_NUMERIC = "numeric";

export function DateTimeGet(options) {
    const year = options.year || FORMAT_NUMERIC;
    const month = options.month || FORMAT_2DIGIT;
    const day = options.day || FORMAT_2DIGIT;
    const hour = options.hour || FORMAT_2DIGIT;
    const minute = options.minute || FORMAT_2DIGIT;
    const second = options.second || FORMAT_2DIGIT;
    const hour12 = options.hour12 || false;
    const timeZone = options.timeZone || undefined;
    const locale = options.locale || undefined;
    const date = options.date || new Date();
    //
    return new Intl
        .DateTimeFormat(locale, {
            year, month, day,
            hour, minute, second,
            hour12,
            timeZone
        })
        .formatToParts(date)
        .reduce((acc, { type, value }) => (
            type === TYPE_LITERAL ? acc : { ...acc, [type]: value}
        ), {})
}