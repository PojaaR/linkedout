var apigClient;
var username;
window.localStorage.setItem('user_id','am11449');

document.querySelector('#recommend-btn-2').addEventListener('click', RecommendedJobsNew);


apigClient = apigClientFactory.newClient({});


loginForm = document.querySelector('#login-form');
registerForm = document.querySelector('#register-form');
profileForm = document.querySelector('#profile-form');
itemNav = document.querySelector('#item-nav');
itemList = document.querySelector('#item-list');
innerMainContainer = document.querySelector('#inner-item-container');
jobTags = document.querySelector('#inner-item-container-row');//
jobList = document.querySelector('#inner-job-list-row');//
jobInformation = document.querySelector('#inner-job-information-row');//
avatar = document.querySelector('#avatar');
welcomeMsg = document.querySelector('#welcome-msg');
logoutBtn = document.querySelector('#logout-link');
likedList = document.querySelector('#inner-job-liked-list-row');//
recoList = document.querySelector('#inner-job-recos-list-row');//

function getJobInformation() {
    console.log("get job info");
    let jobId = $(this).attr("id")
    console.log('JobId', jobId)
    let body = { "job_id": jobId }

    let params = { }

    let additionalParams = { }
    console.log("here")
    apigClient.viewjobPost(params, body, additionalParams).then(function(result)
    {
        console.log(result);
        listJobInformation(result)
    }).catch(function(res) {
        console.log(res);
    })
}

function listJobInformation(result)
	{
		let jobInformationData = result['data']['body'][0]

	    welcomeMsg.innerHTML = 'Welcome, ' + window.localStorage.getItem('user_id');

		$("#jobWallLeft").empty()
		$("#jobWallRight").empty()
		$("#jobList").empty()
		$("#likedList").empty()
		$("#recoList").empty()
		$("#jobInformation").empty()

		showElement(itemNav);
	    hideElement(jobTags);
		hideElement(jobList);
		showElement(jobInformation, "flex");
	    showElement(avatar);
	    showElement(welcomeMsg);
	    showElement(logoutBtn, 'inline-block');
	    // hideElement(loginForm);
	    // hideElement(registerForm);
		// hideElement(profileForm);
		// hideElement(likedList);
		// hideElement(recoList);

		console.log("job information list");
		$("#jobInformation").append("<div id='jobInformationDetails'></div>")

		let title = $("<h1>")
		//title.addClass("item")
		title.text(jobInformationData["title"])
		$("#jobInformationDetails").append(title);

		let company = $("<h5>")
		//country.addClass("item")
		company.text(jobInformationData["company"])
		$("#jobInformationDetails").append(company);

		let descriptionDiv = $("<div style='height:150px;overflow:auto;'>")
		//descriptionDiv.addClass("")
		descriptionDiv.text('About the job: ' + jobInformationData["description"])
		$("#jobInformationDetails").append(descriptionDiv);

		let experience_level = $("<p>");
		//experience_level.addClass("item")
		experience_level.text('Experience Level: ' + jobInformationData["experience_level"])
		$("#jobInformationDetails").append(experience_level);

		let location = $("<p>");
		//location.addClass("item")
		location.text('Location: ' + jobInformationData["location"])
		$("#jobInformationDetails").append(location);

		let url_job_link = $("<a>")
		url_job_link.addClass("btn btn-primary")
		url_job_link.attr("href", jobInformationData["url"]).attr("target", "_blank")
		url_job_link.text("Apply")
		$("#jobInformationDetails").append(url_job_link);

		// let share_job_link = $("<div>")
		// share_job_link.addClass("btn btn-primary")
		// share_job_link.text("Share")
		//$("#jobInformationDetails").append(share_job_link);
		$('.job-like-btn').on('click', ChangeLikedJob);
		//$('.').on('click', sendEmail);

		//let submit_email = $("<form>")

		$("#email-button").on('click', function() { sendEmail(jobInformationData)})
	}


function listJobs(result, likedJobs)
	{
        const likedJobsList = Object.keys(likedJobs)
        console.log("LIKED JOBS")
        console.log(likedJobs)
		let listOfJobs = result['data']
        console.log(listOfJobs)

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
	    // showElement(logoutBtn, 'inline-block');
	    // hideElement(loginForm);
	    // hideElement(registerForm);
		// hideElement(profileForm);
		// hideElement(likedList);
		// hideElement(recoList);

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

			if (likedJobsList.includes(val["job_id"]) )
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




function ChangeLikedJob()
	{
		console.log("likeJob");
		let heartSymbol = $(this).attr('class');
		let jobid = $(this).attr('id').split('_')[1];

		if(heartSymbol.includes('fa-heart-o'))
		{
				$(this).removeClass('fa-heart-o').addClass('fa-heart')
			let body = { "job_id": jobid, "user_id": window.localStorage.getItem('user_id')}

			let params = { }

			let additionalParams = { }

			apigClient.likejobPost(params, body, additionalParams).then(function(result)
			{
				console.log(result);
			}).catch(function(res) {
				console.log(res);
			})
		}
		else{

			$(this).removeClass('fa-heart').addClass('fa-heart-o')

			let body = { "job_id": jobid, "user_id": window.localStorage.getItem('user_id')}

			let params = { }

			let additionalParams = { }

			apigClient.unlikejobPost(params, body, additionalParams).then(function(result)
			{
				console.log(result);

			}).catch(function(res) {
				console.log(res);
			})
		}

	}

function getJobDetailsfromUserRecos(result)
	{
		console.log("retreiving batch job details from list of content-based recommendations");
		let body = {"job_ids": result}
		console.log(body)

		let params = {}

		let additionalParams = { }

		apigClient.getjobbatchPost(params, body, additionalParams).then(function(result)
		{
			console.log(result);
			let data = result["data"];
			console.log(data);
			let body = {"user_id": window.localStorage.getItem('user_id')}
			let params = {}
			let additionalParams = { }

			apigClient.viewuserdetailsPost(params, body, additionalParams).then(function(li)
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
