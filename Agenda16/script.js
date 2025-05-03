document.addEventListener('DOMContentLoaded', function() {
    const resetButton1_12 = document.getElementById('resetButton1_12');
    const resetTimeInput1_12 = document.getElementById('resetTime1_12');
    const resetButton13_16 = document.getElementById('resetButton13_16');
    const resetTimeInput13_16 = document.getElementById('resetTime13_16');
    const activityCheckboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
    const activityTextInputs1_12 = document.querySelectorAll('.text-item input[type="text"]');
    const activityTextInputs13_16 = document.querySelectorAll('.group-13-16 input[type="text"]');
    let intervalId1_12;
    let intervalId13_16;

    function resetActivities1_12() {
        activityCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        activityTextInputs1_12.forEach(input => {
            input.value = '';
        });
        console.log('Attività 1-12 resettate.');
    }

    function resetActivities13_16() {
        activityTextInputs13_16.forEach(input => {
            input.value = '';
        });
        console.log('Attività 13-16 resettate.');
    }

    function checkResetTime1_12() {
        const now = new Date();
        const currentHour = now.getHours().toString().padStart(2, '0');
        const currentMinute = now.getMinutes().toString().padStart(2, '0');
        const currentTime = `${currentHour}:${currentMinute}`;
        const resetTime = resetTimeInput1_12.value;

        if (currentTime === resetTime) {
            resetActivities1_12();
        }
    }

    function checkResetTime13_16() {
        const now = new Date();
        const currentHour = now.getHours().toString().padStart(2, '0');
        const currentMinute = now.getMinutes().toString().padStart(2, '0');
        const currentTime = `${currentHour}:${currentMinute}`;
        const resetTime = resetTimeInput13_16.value;

        if (currentTime === resetTime) {
            resetActivities13_16();
        }
    }

    function startAutomaticReset1_12() {
        intervalId1_12 = setInterval(checkResetTime1_12, 60000);
        console.log('Reset automatico attivato per Attività 1-12.');
    }

    function startAutomaticReset13_16() {
        intervalId13_16 = setInterval(checkResetTime13_16, 60000);
        console.log('Reset automatico attivato per Attività 13-16.');
    }

    startAutomaticReset1_12();
    startAutomaticReset13_16();

    resetButton1_12.addEventListener('click', resetActivities1_12);
    resetButton13_16.addEventListener('click', resetActivities13_16);
});