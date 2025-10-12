const $dateInput = document.querySelector('input[type="date"]');
let $todaysDate = new Date();
let $formatted = $todaysDate.getFullYear() + "-" + ($todaysDate.getMonth() + 1) + "-"+ $todaysDate.getDate();
$dateInput.setAttribute('max', `${$formatted}`);
$dateInput.setAttribute('value', `${$formatted}`);