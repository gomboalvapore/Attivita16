const resetColumnSettings = [
    { offsetInputId: 'utcOffset1', timeInputId: 'resetTime1', countdownId: 'countdownCol1', columns: [1, 5, 9], intervalId: null },
    { offsetInputId: 'utcOffset2', timeInputId: 'resetTime2', countdownId: 'countdownCol2', columns: [2, 6, 10], intervalId: null },
    { offsetInputId: 'utcOffset3', timeInputId: 'resetTime3', countdownId: 'countdownCol3', columns: [3, 7, 11], intervalId: null },
    { offsetInputId: 'utcOffset4', timeInputId: 'resetTime4', countdownId: 'countdownCol4', columns: [4, 8, 12], intervalId: null },
];

const resetButtonGuild = document.getElementById('resetButtonGuild');
const resetTimeGuild = document.getElementById('resetTimeGuild');
const countdownGuild = document.getElementById('countdownGuild');

let activities = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: '',
    10: '',
    11: '',
    12: '',
    guildSeason1: '',
    guildSeason2: '',
    guildSeason3: '',
    guildSeason4: ''
};

function resetSingleActivity(activityIndex) {
    const activityInput = document.getElementById(`activity${activityIndex}`);
    if (activityInput) {
        activityInput.checked = false;
        activityInput.value = '';
        activities[activityIndex] = (activityInput && activityInput.type === 'checkbox') ? false : '';
    }
    console.log(`Attività ${activityIndex} resettata.`, activities);
}

function resetGuildClock() {
    for (let i = 1; i <= 4; i++) {
        const guildSeasonInput = document.getElementById(`guildSeason${i}`);
        if (guildSeasonInput) {
            guildSeasonInput.value = '';
            activities[`guildSeason${i}`] = '';
        }
    }
    console.log('Orologio della gilda resettato:', activities);
}

function updateCountdownColumn(settings) {
    const offsetInput = document.getElementById(settings.offsetInputId);
    const timeInput = document.getElementById(settings.timeInputId);
    const countdownElement = document.getElementById(settings.countdownId);

    const nowUTC = moment.utc();
    const utcOffset = parseInt(offsetInput.value, 10);
    const resetTimeInputValue = timeInput.value;
    const [resetHour, resetMinute] = resetTimeInputValue.split(':').map(Number);

    const targetMomentUTC = moment.utc().set({ hour: resetHour, minute: resetMinute, second: 0, millisecond: 0 }).subtract(utcOffset, 'hours');

    let nowOffset = moment().utcOffset(utcOffset * 60);
    let targetMomentOffset = moment.utc().set({ hour: resetHour, minute: resetMinute, second: 0, millisecond: 0 }).subtract(utcOffset, 'hours').utcOffset(utcOffset * 60);

    if (targetMomentOffset.isSameOrBefore(nowOffset)) {
        targetMomentOffset.add(1, 'day');
    }

    const duration = moment.duration(targetMomentOffset.diff(nowOffset));
    countdownElement.textContent = `Reset in (UTC${utcOffset >= 0 ? '+' : ''}${utcOffset}): ${duration.hours().toString().padStart(2, '0')}:${duration.minutes().toString().padStart(2, '0')}:${duration.seconds().toString().padStart(2, '0')}`;
}

function checkResetTimeColumn(settings) {
    const offsetInput = document.getElementById(settings.offsetInputId);
    const timeInput = document.getElementById(settings.timeInputId);
    const utcOffset = parseInt(offsetInput.value, 10);
    const resetTimeInputValue = timeInput.value;
    const [resetHour, resetMinute] = resetTimeInputValue.split(':').map(Number);

    const nowUTC = moment.utc();
    const currentHourToCheck = nowUTC.subtract(utcOffset, 'hours').hours();
    const currentMinuteToCheck = nowUTC.subtract(utcOffset, 'hours').minutes();

    if (currentHourToCheck === resetHour && currentMinuteToCheck === resetMinute) {
        settings.columns.forEach(index => resetSingleActivity(index));
        updateCountdownColumn(settings); // Aggiorna il countdown della colonna dopo il reset automatico
    }
}

function updateCountdownGuild() {
    const nowUTC = moment.utc();
    const resetTimeInputValue = resetTimeGuild.value;
    const [resetHour, resetMinute] = resetTimeInputValue.split(':').map(Number);
    const targetMoment = moment.utc().set({ hour: resetHour, minute: resetMinute, second: 0, millisecond: 0 });
    if (targetMoment.isSameOrBefore(nowUTC)) {
        targetMoment.add(1, 'day');
    }
    const duration = moment.duration(targetMoment.diff(nowUTC));
     countdownGuild.textContent = `Reset in (UTC): ${duration.hours().toString().padStart(2, '0')}:${duration.minutes().toString().padStart(2, '0')}:${duration.seconds().toString().padStart(2, 0)}`;
}

function checkResetTimeGuild() {
    const nowUTC = moment.utc();
    const resetTimeInputValue = resetTimeGuild.value;
    const [resetHour, resetMinute] = resetTimeInputValue.split(':').map(Number);
    if (nowUTC.hours() === resetHour && nowUTC.minutes() === resetMinute) {
        resetGuildClock();
        updateCountdownGuild(); // Aggiorna il countdown dopo il reset
    }
}

resetButtonGuild.addEventListener('click', () => {
    resetGuildClock();
    updateCountdownGuild();
});

resetColumnSettings.forEach(settings => {
    const button = document.querySelector(`.reset-column-button[data-columns="${settings.columns.join(',')}"]`);
    button.addEventListener('click', function() {
        const columnsToReset = this.getAttribute('data-columns').split(',').map(Number);
        columnsToReset.forEach(index => {
            resetSingleActivity(index);
        });
        updateCountdownColumn(settings); // Aggiorna il countdown della colonna dopo il reset manuale
    });

    // Avvia l'aggiornamento del countdown per ogni colonna
    setInterval(() => updateCountdownColumn(settings), 1000);
    // Avvia il controllo dell'orario di reset per ogni colonna
    setInterval(() => checkResetTimeColumn(settings), 60000); // Controlla ogni minuto
    updateCountdownColumn(settings); // Inizializza il countdown
});

// Avvia l'aggiornamento del countdown per l'orologio della gilda
setInterval(updateCountdownGuild, 1000);
// Avvia il controllo dell'orario di reset per l'orologio della gilda
setInterval(checkResetTimeGuild, 60000); // Controlla ogni minuto
updateCountdownGuild(); // Inizializza il countdown