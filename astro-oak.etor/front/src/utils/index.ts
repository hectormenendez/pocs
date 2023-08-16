import { RX_DATE } from "src/confs";

export function parseDate(raw: string): Date {
    const match = String(raw).match(RX_DATE);
    if (!match) throw new Error(`Date "${raw}" does not match format: YYYY/MM/DD`);
    const [_, year, month, day] = match;
    return new Date(
        parseInt(year as string, 10),
        parseInt(month as string, 10) - 1,
        parseInt(day as string, 10),
    );
}

export function getYears(from: Date, to: Date) {
    return Math.floor((from.getTime() - to.getTime()) / (1000 * 60 * 60 * 24 * 365));
}

export function getMonth(date: Date) {
    const month = date.getMonth();
    switch (month) {
        case 0:
            return "Enero";
        case 1:
            return "Febrero";
        case 2:
            return "Marzo";
        case 3:
            return "Abril";
        case 4:
            return "Mayo";
        case 5:
            return "Junio";
        case 6:
            return "Julio";
        case 7:
            return "Agosto";
        case 8:
            return "Septiembre";
        case 9:
            return "Octubre";
        case 10:
            return "Noviembre";
        case 11:
            return "Diciembre";
        default:
            throw new Error("Invalid Date");
    }
}
