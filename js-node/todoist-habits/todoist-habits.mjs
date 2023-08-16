import { HabitsGet } from "./lib/habits.mjs"


(async function() {
    const habits = await HabitsGet();
    habits.filter(habit => habit.isPastDue).forEach(async habit => await habit.streakReset())
    habits.filter(habit => !habit.isPastDue).forEach(async habit => await habit.streakIncrease());
})();
