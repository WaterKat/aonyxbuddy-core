const email = document.getElementById('email') as HTMLInputElement;
const username = document.getElementById('username') as HTMLInputElement;
const password = document.getElementById("password") as HTMLInputElement;
const confirmPassword = document.getElementById("confirm-password") as HTMLInputElement;

function validateEmail() : boolean {
    if (!email.value.includes('@')){
        email.setCustomValidity('Invalid email!');
        email.reportValidity();
        return false;
    }

    email.setCustomValidity('');
    email.reportValidity();
    return true;
}

function validateUsername() : boolean {
    if (username.value.length < 6){
        username.setCustomValidity('Your username must be at least 6 characters.');
        username.reportValidity();
        return false;
    }

    username.setCustomValidity('');
    username.reportValidity();
    return true;
}

function validatePassword() : boolean {
    if (!password.value) {
        password.setCustomValidity('Password cannot be empty!');
        password.reportValidity();
        return false;
    }
    if (password.value.length < 8) {
        password.setCustomValidity('Password must be at least 8 characters!');
        password.reportValidity();
        return false;
    }
    password.setCustomValidity('');
    password.reportValidity();

    if (password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity('Passwords don\'t match!');
        confirmPassword.reportValidity();
        return false;
    }
    confirmPassword.setCustomValidity('');
    confirmPassword.reportValidity();

    return true;
}

(email as HTMLElement).onchange = validateEmail;
(username as HTMLElement).onchange = validateUsername;
(password as HTMLElement).onchange = validatePassword;
(confirmPassword as HTMLElement).onchange = validatePassword;
