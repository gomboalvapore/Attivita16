const resetColumnSettings = [
    { offsetInputId: 'utcOffset1', timeInputId: 'resetTime1', countdownId: 'countdownCol1', columns: [1, 5, 9], playerIndex: 1, playerTimerId: 'player1-timer' },
    { offsetInputId: 'utcOffset2', timeInputId: 'resetTime2', countdownId: 'countdownCol2', columns: [2, 6, 10], playerIndex: 2, playerTimerId: 'player2-timer' },
    { offsetInputId: 'utcOffset3', timeInputId: 'resetTime3', countdownId: 'countdownCol3', columns: [3, 7, 11], playerIndex: 3, playerTimerId: 'player3-timer' },
    { offsetInputId: 'utcOffset4', timeInputId: 'resetTime4', countdownId: 'countdownCol4', columns: [4, 8, 12], playerIndex: 4, playerTimerId: 'player4-timer' },
    { offsetInputId: 'utcOffset5', timeInputId: 'resetTime5', countdownId: 'countdownCol5', columns: [13, 15, 17], playerIndex: 5, playerTimerId: 'player5-timer' },
    { offsetInputId: 'utcOffset6', timeInputId: 'resetTime6', countdownId: 'countdownCol6', columns: [14, 16, 18], playerIndex: 6, playerTimerId: 'player6-timer' }
];

const resetButtonGuild = document.getElementById('resetButtonGuild');
const resetTimeGuild = document.getElementById('resetTimeGuild');
const countdownGuild = document.getElementById('countdownGuild');

let activities = {
    1: false,  2: false,  3: false,  4: false,  5: false,  6: false,
    7: false,  8: false,  9: '',     10: '',    11: '',    12: '',
    13: false, 14: false, 15: false, 16: false, 17: '',    18: '',
    guildSeason1: '', guildSeason2: '', guildSeason3: '', guildSeason4: '',
    guildSeason5: '', guildSeason6: ''
};

function saveActivities() {
    localStorage.setItem('activities', JSON.stringify(activities));
}

function loadActivities() {
    const savedActivities = localStorage.getItem('activities');
    if (savedActivities) {
        activities = JSON.parse(savedActivities);
    }
}

function resetSingleActivity(activityIndex) {
    const activityInput = document.getElementById(`activity${activityIndex}`);
    if (activityInput) {
        if (activityInput.type === 'checkbox') {
            activityInput.checked = false;
            activities[activityIndex] = false;
        } else {
            activityInput.value = '';
            activities[activityIndex] = '';
        }
        saveActivities();
    }
}

function resetGuildClock() {
    for (let i = 1; i <= 6; i++) {
        const guildSeasonInput = document.getElementById(`guildSeason${i}`);
        if (guildSeasonInput) {
            guildSeasonInput.value = '';
            activities[`guildSeason${i}`] = '';
        }
    }
    saveActivities();
}

function updatePlayerTimer(settings) {
    const playerTimerElement = document.getElementById(settings.playerTimerId);
    if (!playerTimerElement) {
        console.log(`Timer element not found: ${settings.playerTimerId}`);
        return;
    }

    const offsetInput = document.getElementById(settings.offsetInputId);
    const timeInput = document.getElementById(settings.timeInputId);

    if (!offsetInput || !timeInput) {
        console.log(`Offset or time input not found for: ${settings.offsetInputId}, ${settings.timeInputId}`);
        return;
    }

    const utcOffset = parseInt(offsetInput.value, 10);
    const resetTimeInputValue = timeInput.value;
    const [resetHour, resetMinute] = resetTimeInputValue.split(':').map(Number);

    let nowUTC = moment.utc();
    let targetMomentUTC = moment.utc().set({ hour: resetHour, minute: resetMinute, second: 0, millisecond: 0 }).subtract(utcOffset, 'hours').subtract(9, 'hours');

    while (targetMomentUTC.isSameOrBefore(nowUTC)) {
        targetMomentUTC.add(1, 'day');
    }

    let duration = moment.duration(targetMomentUTC.diff(nowUTC));
    let totalSeconds = Math.floor(duration.asSeconds());
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    playerTimerElement.textContent = formattedTime;

    // Freccia lampeggiante
    let durationMinutes = duration.asMinutes();
    const arrowElement = document.getElementById(`prestigio-arrow-${settings.playerIndex}`);
    if (arrowElement) {
        arrowElement.style.display = durationMinutes < 62 ? 'inline' : 'none';
    } else {
        console.warn(`Freccia non trovata: prestigio-arrow-${settings.playerIndex}`);
    }

    // Emoticon di avviso
    const alertElement = document.getElementById(`prestigio-alert-${settings.playerIndex}`);
    if (alertElement) {
        if (durationMinutes < 15) {
            alertElement.textContent = ' 😱';
            alertElement.style.display = 'inline';
            alertElement.classList.add('blink-alert');
        } else {
            alertElement.textContent = '';
            alertElement.style.display = 'none';
            alertElement.classList.remove('blink-alert');
        }
    } else {
        console.warn(`Elemento alert non trovato: prestigio-alert-${settings.playerIndex}`);
    }
}

function updateCountdownColumn(settings) {
    const offsetInput = document.getElementById(settings.offsetInputId);
    const timeInput = document.getElementById(settings.timeInputId);
    const countdownElement = document.getElementById(settings.countdownId);

    if (!offsetInput || !timeInput || !countdownElement) return;

    const nowUTC = moment.utc();
    const utcOffset = parseInt(offsetInput.value, 10);
    const resetTimeInputValue = timeInput.value;
    const [resetHour, resetMinute] = resetTimeInputValue.split(':').map(Number);

    let targetMomentUTC = moment.utc().set({ hour: resetHour, minute: resetMinute, second: 0, millisecond: 0 }).subtract(utcOffset, 'hours');

    while (targetMomentUTC.isSameOrBefore(nowUTC)) {
        targetMomentUTC.add(1, 'day');
    }

    const duration = moment.duration(targetMomentUTC.diff(nowUTC));
    const hours = duration.hours().toString().padStart(2, '0');
    const minutes = duration.minutes().toString().padStart(2, '0');
    const seconds = duration.seconds().toString().padStart(2, '0');

    countdownElement.textContent = `Reset in (UTC${utcOffset >= 0 ? '+' : ''}${utcOffset}): ${hours}:${minutes}:${seconds}`;

    if (settings.playerTimerId) {
        updatePlayerTimer(settings);
    }
}

function checkResetTimeColumn(settings) {
    const offsetInput = document.getElementById(settings.offsetInputId);
    const timeInput = document.getElementById(settings.timeInputId);

    if (!offsetInput || !timeInput) return;

    const utcOffset = parseInt(offsetInput.value, 10);
    const resetTimeInputValue = timeInput.value;
    const [resetHour, resetMinute] = resetTimeInputValue.split(':').map(Number);

    const nowUTC = moment.utc();
    let targetMomentUTC = moment.utc().set({ hour: resetHour, minute: resetMinute, second: 0, millisecond: 0 }).subtract(utcOffset, 'hours');

    // Se il target è già passato, aggiungi un giorno
    if (targetMomentUTC.isSameOrBefore(nowUTC)) {
        targetMomentUTC.add(1, 'day');
    }

    const diffInSeconds = targetMomentUTC.diff(nowUTC, 'seconds');

    if (diffInSeconds >= 0 && diffInSeconds <= 8) {
        settings.columns.forEach(index => resetSingleActivity(index));
        updateCountdownColumn(settings);
    }
}

function updateCountdownGuild() {
    const nowUTC = moment.utc();
    const resetTimeInputValue = resetTimeGuild.value;
    const [resetHour, resetMinute] = resetTimeInputValue.split(':').map(Number);

    let targetMoment = moment.utc().set({ hour: resetHour, minute: resetMinute, second: 0, millisecond: 0 });

    while (targetMoment.isSameOrBefore(nowUTC)) {
        targetMoment.add(1, 'day');
    }

    const duration = moment.duration(targetMoment.diff(nowUTC));
    const hours = duration.hours().toString().padStart(2, '0');
    const minutes = duration.minutes().toString().padStart(2, '0');
    const seconds = duration.seconds().toString().padStart(2, '0');

    countdownGuild.textContent = `Reset in (UTC): ${hours}:${minutes}:${seconds}`;
}

function checkResetTimeGuild() {
    const nowUTC = moment.utc();
    const resetTimeInputValue = resetTimeGuild.value;
    const [resetHour, resetMinute] = resetTimeInputValue.split(':').map(Number);

    let targetMoment = moment.utc().set({ hour: resetHour, minute: resetMinute, second: 0, millisecond: 0 });

    while (targetMoment.isSameOrBefore(nowUTC)) {
        targetMoment.add(1, 'day');
    }

    const diffGuildInSeconds = nowUTC.diff(targetMoment, 'seconds');
    if (diffGuildInSeconds >= 0 && diffGuildInSeconds < 9) {
        resetGuildClock();
        updateCountdownGuild();
    }
}

resetButtonGuild.addEventListener('click', () => {
    resetGuildClock();
    updateCountdownGuild();
});

function saveColumnSettings(settings) {
    const offsetInput = document.getElementById(settings.offsetInputId);
    const timeInput = document.getElementById(settings.timeInputId);
    if (offsetInput && timeInput) {
        localStorage.setItem(settings.offsetInputId, offsetInput.value);
        localStorage.setItem(settings.timeInputId, timeInput.value);
    }
}

function loadColumnSettings(settings) {
    const offsetInput = document.getElementById(settings.offsetInputId);
    const timeInput = document.getElementById(settings.timeInputId);
    if (offsetInput && timeInput) {
        const savedOffset = localStorage.getItem(settings.offsetInputId);
        const savedTime = localStorage.getItem(settings.timeInputId);
        if (savedOffset) offsetInput.value = savedOffset;
        if (savedTime) timeInput.value = savedTime;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    resetColumnSettings.forEach(settings => {
        const offsetInput = document.getElementById(settings.offsetInputId);
        const timeInput = document.getElementById(settings.timeInputId);
        if (offsetInput && timeInput) {
            loadColumnSettings(settings);
        }
    });

    loadActivities();
    for (const key in activities) {
        const activityInput = document.getElementById(`activity${key}`);
        if (activityInput) {
            if (activityInput.type === 'checkbox') {
                activityInput.checked = activities[key];
                activityInput.addEventListener('change', () => {
                    activities[key] = activityInput.checked;
                    saveActivities();
                });
            } else {
                activityInput.value = activities[key];
                activityInput.addEventListener('change', () => {
                    activities[key] = activityInput.value;
                    saveActivities();
                });
            }
        }

        const guildSeasonInput = document.getElementById(`guildSeason${key}`);
        if (guildSeasonInput) {
          guildSeasonInput.value = activities[`guildSeason${key}`];
          guildSeasonInput.addEventListener('change', () => {
            activities[`guildSeason${key}`] = guildSeasonInput.value;
            saveActivities();
          });
        }
    }

    resetColumnSettings.forEach(settings => {
        const button = document.querySelector(`.reset-column-button[data-columns="${settings.columns.join(',')}"]`);
        const offsetInput = document.getElementById(settings.offsetInputId);
        const timeInput = document.getElementById(settings.timeInputId);

        if (button && offsetInput && timeInput) {
            button.addEventListener('click', () => {
                const columnsToReset = settings.columns.map(Number);
                columnsToReset.forEach(index => resetSingleActivity(index));
                updateCountdownColumn(settings);
            });

            offsetInput.addEventListener('change', () => saveColumnSettings(settings));
            timeInput.addEventListener('change', () => saveColumnSettings(settings));

            // Chiama loadColumnSettings immediatamente dopo aver collegato gli event listener
            loadColumnSettings(settings);

            setInterval(() => updateCountdownColumn(settings), 1000);
            setInterval(() => checkResetTimeColumn(settings), 8000);
            updateCountdownColumn(settings);
        }
    });

    setInterval(updateCountdownGuild, 1000);
    setInterval(() => checkResetTimeGuild(), 8000);
    updateCountdownGuild();
});