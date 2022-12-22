var apigClient;
var username;
window.localStorage.setItem('user_id','am11449');
document.querySelector('#recommend-btn-2').addEventListener('click', RecommendedJobsNew);
apigClient = apigClientFactory.newClient({});
welcomeMsg = document.querySelector('#welcome-msg');
itemNav = document.querySelector('#item-nav');  
avatar = document.querySelector('#avatar');
logoutBtn = document.querySelector('#logout-link');

function listJobs(result, likedJobs)
	{
		let listOfJobs = result['data']

		$("#jobWallLeft").empty()
		$("#jobWallRight").empty()
		$("#jobList").empty()
		$("#likedList").empty()
		$("#recoList").empty()
		$("#jobInformation").empty()

	    welcomeMsg.innerHTML = 'Welcome, ' + window.localStorage.getItem('user_id');

		showElement(itemNav);
	    hideElement(jobTags);
		showElement(jobList, "flex");
		hideElement(jobInformation);
	    showElement(avatar);
	    showElement(welcomeMsg);
	    showElement(logoutBtn, 'inline-block');
	    hideElement(loginForm);
	    hideElement(registerForm);
		hideElement(profileForm);
		hideElement(likedList);
		hideElement(recoList);

		console.log("create list");
		$("#jobList").append("<ul id='jobListUL' class='item-list'></ul>")
		$.each(listOfJobs, function(index, val) {
			console.log(val);
			let listItem = $("<li>")
			listItem.addClass("item")
			// listItem.append("<i class='fa fa-heart fa-2x'</i>")


			let jobDiv = $("<div>")
			let jobName = $("<a>")

			jobName.addClass("job-item-name").attr("href", "#").attr("id", val["job_id"])

			let likeDiv = $("<div>")
			let likeDiveIcon = $("<i>")

			likeDiv.addClass("fav-link")

			if (likedJobs.includes(val["job_id"]) )
			{
				likeDiveIcon.addClass("fa fa-heart").addClass('job-like-btn').attr("id", "icon_"+val["job_id"])
			}
			else
			{
				likeDiveIcon.addClass("fa fa-heart-o").addClass('job-like-btn').attr("id", "icon_"+val["job_id"])
			}

			likeDiv.append(likeDiveIcon)

			jobName.text(val["title"] + ' - ' + val["company"])
			jobDiv.append(jobName)

			listItem.append(jobDiv)
			listItem.append(likeDiv)
			console.log(listItem);

			$("#jobListUL").append(listItem);
		})
		$('.job-like-btn').on('click', ChangeLikedJob);
		$('.job-item-name').on('click', getJobInformation);
	}

function getJobDetailsfromUserRecos(result)
	{
		console.log("retireiving batch job details from list of content-based recommendations");
		let body = {"job_ids": result}
		console.log(body)

		let params = {}

		let additionalParams = { }

		apigClient.getjobbatchPost(params, body, additionalParams).then(function(result)
		{
			console.log(result);
			let data = result["data"];
			console.log(data);
			let body = { }
			let params = {"userid": window.localStorage.getItem('user_id')}
			let additionalParams = { }

			apigClient.viewuserdetailsGet(params, body, additionalParams).then(function(li)
			{
				console.log("API to get user liked jobs...")
				let data = li["data"];
				let liked_li = data["liked_jobs"];
				listJobs(result, liked_li);
			}).catch(function(res) {
				console.log(res);
			})
		}).catch(function(res) {
			console.log(res);
		})
	}

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
    // showElement(jobTags, "flex");
//   hideElement(jobList, "flex");
//   hideElement(likedList);
    showElement(avatar);
    showElement(welcomeMsg);
    showElement(logoutBtn, 'inline-block');
    // hideElement(loginForm);
    // hideElement(registerForm);
//   hideElement(profileForm);
//   hideElement(recoList);

  let divItem = $("<div>")
  divItem.addClass("card")
//   divItem.append("<img src='content.jpg' alt='Collab' style='width:30%'>")
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
  let reqBody = { 'user_id': window.localStorage.getItem('user_id') };

  let params = { };

  let additionalParams = { };

  apigClient.getcontentbasedrecsPost(params, reqBody, additionalParams).then(function(result)
  {
    console.log(result);
    let data = result["data"]["body"]["job_details"];
    console.log(data);
    getJobDetailsfromUserRecos(data);
  }); 

}
