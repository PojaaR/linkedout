var apigClient;
var username = document.querySelector('#username').value;
document.querySelector('#recommend-btn-2').addEventListener('click', RecommendedJobsNew);
apigClient = apigClientFactory.newClient({});
function RecommendedJobsNew()
{
  console.log("new Recos UI");
  $("#jobWallLeft").empty()
  $("#jobWallRight").empty()
  $("#jobList").empty()
  $("#recoList").empty()
  $("#likedList").empty()
  $("#jobInformation").empty()

  showElement(itemNav);
    showElement(jobTags, "flex");
  hideElement(jobList, "flex");
  hideElement(likedList);
    showElement(avatar);
    showElement(welcomeMsg);
    showElement(logoutBtn, 'inline-block');
    hideElement(loginForm);
    hideElement(registerForm);
  hideElement(profileForm);
  hideElement(recoList);

  let divItem = $("<div>")
  divItem.addClass("card")
  divItem.append("<img src='content.jpg' alt='Collab' style='width:30%'>")
  let divItemInner = $("<div>")
  divItemInner.addClass("cont")
  divItemInner.append("<h4><b>Based on your skills</b></h4>").addClass("content-based").attr("href", "#")
  divItemInner.append("<p>These are jobs recommended for you based on skills you provided as well as skills extracted from your resume. Check them out!</p>")

  divItem.append(divItemInner)

  $("#jobWallLeft").append(divItem);

  $('.content-based').on('click', getContentBasedRecommendedJobs);
}


function getContentBasedRecommendedJobs()
{
  console.log("Content Based Recommendations...");
  let reqBody = { 'user_id': username };

  let params = { };

  let additionalParams = { };

  apigClient.getcontentbasedrecsPost(params, reqBody, additionalParams).then(function(result)
  {
    console.log(result);
    let data = result["data"];
    console.log(data);
  });

}
