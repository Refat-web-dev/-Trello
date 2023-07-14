export function calendar(id) {
    // Инициализация "flatpickr" с настройками
    flatpickr(id, {
        dateFormat: "d.m.Y", // Формат даты
        minDate: "today", // Минимальная дата (сегодняшняя дата)
        maxDate: new Date().fp_incr(30), // Максимальная дата (через 30 дней от сегодняшней даты)
        locale: {
            firstDayOfWeek: 1, // Понедельник как первый день недели
            weekdays: {
                shorthand: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
                longhand: [
                    "Воскресенье",
                    "Понедельник",
                    "Вторник",
                    "Среда",
                    "Четверг",
                    "Пятница",
                    "Суббота",
                ],
            },
            months: {
                shorthand: [
                    "Янв",
                    "Фев",
                    "Мар",
                    "Апр",
                    "Май",
                    "Июн",
                    "Июл",
                    "Авг",
                    "Сен",
                    "Окт",
                    "Ноя",
                    "Дек",
                ],
                longhand: [
                    "Январь",
                    "Февраль",
                    "Март",
                    "Апрель",
                    "Май",
                    "Июнь",
                    "Июль",
                    "Август",
                    "Сентябрь",
                    "Октябрь",
                    "Ноябрь",
                    "Декабрь",
                ],
            },
        },
    });

}