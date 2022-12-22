loginForm = document.querySelector('#login-form');
document.querySelector('#login-btn').addEventListener('click', login);

function login() {
  var username = document.querySelector('#username').value;
  var password = document.querySelector('#password').value;

let authenticationData = {
      Username : username,
      Password : password,
  };
  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  console.log(authenticationDetails);
  getUser(username).authenticateUser(authenticationDetails,  {
  onSuccess: result => onSessionValid(username),
     onFailure: err => {
    console.log(err);
    document.querySelector('#login-error').innerHTML = "Invalid Login";
  }
});

}