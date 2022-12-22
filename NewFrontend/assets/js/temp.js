function updateProfile() {
    // let verif_code = document.querySelector('#profile-verif-code').value;
    var uni = document.querySelector('#profile-uni').value;
    var fname = document.querySelector('#profile-firstname').value;
    var lname = document.querySelector('#profile-lastname').value;
    var major = document.querySelector('#profile-major').value;
    var highestDeg = document.querySelector('#profile-highest-deg').value;
    let grad_year = document.querySelector('#profile-grad-year').value;
    let skills_str = document.querySelector('#profile-skills-list').value;
    let int_roles_str = document.querySelector('#profile-int-roles').value;


    let reqBody = {
        'user_id': uni,
        'email_id': cognitoUser['username'],
        'highest_degree': highestDeg,
        'first_name': fname,
        'last_name': lname,
        'degree': major,
        'graduation_year': grad_year,
        'interested_roles': int_roles_str,
        'skills': skills_str
    }

    let params = { }

    let additionalParams = {
        headers: {
            'Content-Type':"application/json"
        }
    }

    console.log(reqBody);
    // console.log(verif_code);
    apigClient.putdetailsPut(params, reqBody, additionalParams).then(function(result)
    {
        console.log(result);
        showProfileResult('Succesfully registered');
    }).catch(function(res) {
        console.log(res);
        showProfileResult('Failed to register');
    })

}