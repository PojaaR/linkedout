var apigClient;
var username;

document.querySelector('#fav-btn').addEventListener('click', createProfileView);

apigClient = apigClientFactory.newClient({});