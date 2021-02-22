"use strict";

myHeight.addEventListener('input', ev => {
  document.documentElement.style.setProperty('--height', `${myHeight.value}%`);
});

myBG.addEventListener('input', ev => {
  document.documentElement.style.setProperty('--bg-colour', myBG.value);
});
myFG.addEventListener('input', ev => {
  document.documentElement.style.setProperty('--fg-colour', myFG.value);
});

const checkConfirmation = (ev) => {
 if (myPassword.value != myConfirmation.value) {
  myConfirmation.setCustomValidity("Wait. What? This doesn't match the password field!");
 } else {
  myConfirmation.setCustomValidity('');
 }
};

myConfirmation.addEventListener('input', checkConfirmation);
myPassword.addEventListener('input', checkConfirmation);

login.addEventListener('submit', ev => {
 alert(`logged in as ${myUser.value}`)
 login.reset();
 ev.preventDefault();
});
