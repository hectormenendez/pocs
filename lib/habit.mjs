import { ErrorThrow } from "./error.mjs";

export const NAME = "Habit";
export const REGEX_HABIT =  "{([0-9]+)}";
export const REGEX_FLAG = "";

export function HabitGet(item) {
    try {
        const { content } = item;
        const match = content.match(new RegExp(REGEX_HABIT, REGEX_FLAG));
        const conditions = [
            match,
            !item.in_history, // must not be archived
            item.due && item.due.is_recurring, // must have a recurring date
        ];
        if (conditions.length !== conditions.filter(Boolean).length) return null;
        return new Habit({ item, streak: parseInt(match[1], 10) });
    } catch ({ message }){
        return ErrorThrow({
            message,
            name: `${NAME}Error`,
            hasStack: process.env.DEBUG,
        });
    }

}

export class Habit {
    #item
    #streak

    constructor({ item, streak }) {
        this.#item = item;
        this.#streak = streak;
    }

}