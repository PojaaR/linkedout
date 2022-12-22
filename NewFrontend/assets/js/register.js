var apigClient;
var registerForm;
var profileForm;
var username;

document.querySelector('#register-btn').addEventListener('click', register);

profileForm = document.querySelector('#profile-form');
registerForm = document.querySelector('#register-form');
document.querySelector('#update-profile-btn').addEventListener('click', updateProfile);

apigClient = apigClientFactory.newClient({});

hideElement(profileForm);

function showProfileResult(registerMessage) {
    document.querySelector('#profile-result').innerHTML = registerMessage;
}

function showRegisterResult(registerMessage) {
    document.querySelector('#register-result').innerHTML = registerMessage;
}

function register() {
    hideElement(registerForm);
    showElement(profileForm);
    username = document.querySelector('#register-username').value;
    var password = document.querySelector('#register-password').value;
    console.log(username)
    console.log(password)
    console.log("Called!")
    if (!username || !password) {
        showRegisterResult('Please fill in all fields');
        return
    }
}

function updateProfile() {
    // let verif_code = document.querySelector('#profile-verif-code').value;
    // var uni = document.querySelector('#profile-uni').value;
    var fname = document.querySelector('#profile-firstname').value;
    var lname = document.querySelector('#profile-lastname').value;
    var major = document.querySelector('#profile-major').value;
    var highestDeg = document.querySelector('#profile-highest-deg').value;
    let grad_year = document.querySelector('#profile-grad-year').value;
    let skills_str = document.querySelector('#profile-skills-list').value;
    let int_roles_str = document.querySelector('#profile-int-roles').value;


    let reqBody = {
        'user_id': username,
        'highest_deg': highestDeg,
        'first_name': fname,
        'last_name': lname,
        'degree': major,
        'year_of_grad': grad_year,
        'interested_roles': int_roles_str,
        'skills_input': skills_str
    }

    let params = { }

    let additionalParams = {
        headers: {
            'Content-Type':"application/json"
        }
    }

    console.log(reqBody);
    // console.log(verif_code);
    apigClient.createuserPost(params, reqBody, additionalParams).then(function(result)
    {
        console.log(result);
        showProfileResult('Succesfully registered');
    }).catch(function(res) {
        console.log(res);
        showProfileResult('Failed to register');
    })
}