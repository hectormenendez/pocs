import { ErrorThrow } from "./error.mjs";
import { TodoistGet, TODOIST_ENDPOINT } from "./todoist.mjs";
import { DateTimeGet } from "./datetime.mjs";

export const NAME = "Habit";
export const REGEX_HABIT =  "^`([0-9]+)(?:\/([0-9]+))?`";
export const REGEX_FLAG = "";

const SEP_DATE = "-";
const SEP_TIME = "T";

let api;
let today;

export async function HabitsGet() {
    if (!api) {
        api = await TodoistGet();
    }
    if (!today) {
        const { timezone: timeZone } = api.user.get().tz_info;
        const { year, month, day } = DateTimeGet({ timeZone });
        today = [year,month,day].join(SEP_DATE);
    }
    const habits = api.items
        .get()
        .map(HabitGet)
        .filter(Boolean);

    return habits;
}

function HabitGet(item) {
    try {
        const { content } = item;
        const match = content.match(new RegExp(REGEX_HABIT, REGEX_FLAG));
        const conditions = [
            match,
            !item.in_history, // must not be archived
            item.due && item.due.is_recurring, // must have a recurring date
        ];
        if (conditions.length !== conditions.filter(Boolean).length) return null;
        return new Habit({
            item,
            streak: parseInt(match[1], 10),
            record: parseInt(match[2], 10),
        });
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

    constructor({ item, streak, record }) {
        this.#item = item;
        this.id = item.id;
        this.isPastDue = Date.parse(today) > Date.parse(item.due.date.slice(0, today.length));
        this.streak = streak;
        this.record = record || streak;
    }

    async #streakUpdate({ streak, record, type }) {
        const rx = new RegExp(REGEX_HABIT);
        const old = this.#item.content;
        const content = this.#item.content.replace(
            rx,
            streak === record ? `\`${streak}\`` : `\`${streak}/${record}\``
        );
        await api.items.update({ id: this.id, content });
        console.log(`[${type}] ${old} → ${content}`);
    }

    async streakReset() {
        if (!this.streak) return;
        return await this.#streakUpdate({ streak: 0, record: this.record, type: "RESET" });
    }

    // if current streak is equal to record, then write a sigle number,
    // otherwise, write a split containing both numbers.
    async streakIncrease() {
        // check for completed events for this identifier
        const { events } = await api.activityLog.get({
            endpoint: TODOIST_ENDPOINT,
            object_type: "item",
            object_id: this.id,
            event_type: "completed",
        });
        // but only consider today's events
        const event = events
            .filter(({ event_date }) => (
                Date.parse(event_date.slice(0, today.length)) === Date.parse(today)
            ))
            .shift();
        if (!event) return;
        // the task was completed today, update the streak.
        const streak = this.streak + 1;
        const record = streak > this.record ? streak : this.record;
        return await this.#streakUpdate({ streak, record, type: "INCREASE"});
    }

}