var apigClient;
var username;
window.localStorage.setItem('user_id','am11449');

document.querySelector('#recommend-btn').addEventListener('click', getUserLikedJobs);

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


function RemoveLikedJob()
	{
		console.log("likeJob");
		let heartSymbol = $(this).attr('class');
		let jobid = $(this).attr('id').split('_')[1];
		let body = {"job_id": jobid, "user_id": window.localStorage.getItem('user_id') }

		let params = { }

		let additionalParams = { }

		apigClient.unlikejobPost(params, body, additionalParams).then(function(result)
		{
			console.log(result);
			getUserLikedJobs();

		}).catch(function(res) {
			console.log(res);
		})

	}

function getJobInformation() {
		console.log("get job info");
		let jobId = $(this).attr("id")
		console.log('JobId', jobId)
		let body = {"job_id": jobId }

		let params = {  }

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

function getUserLikedJobs()
	{
		console.log("list liked");

		let body = {"user_id": window.localStorage.getItem('user_id')}

		let params = {}

		let additionalParams = { }

		apigClient.viewuserdetailsPost(params, body, additionalParams).then(function(result)
		{
			console.log(result);
			let data = result["data"];
			let li = data["liked_jobs"];
			const li_keys = Object.keys(li);
			console.log("LIKED JOBSSSS");
			console.log(li_keys);
			// console.log(li);


			getJobDetailsfromUserLiked(li_keys);

		})

	}

function getJobDetailsfromUserLiked(result)
{
    console.log("retireiving batch job details from list of jobs liked by the user");
    let body = {"job_ids": result}
    console.log(body)

    let params = {}

    let additionalParams = { }

    apigClient.getjobbatchPost(params, body, additionalParams).then(function(result)
    {
        console.log(result);
        let data = result["data"];
        
        console.log(data);
        listLikedJobs(data);
    })
}

function listLikedJobs(result)
{
		$("#jobWallLeft").empty()
		$("#jobWallRight").empty()
		$("#jobList").empty()
		$("#likedList").empty()
		$("#recoList").empty()
		$("#jobInformation").empty()

		showElement(itemNav);
	    hideElement(jobTags);
		hideElement(jobList);
		showElement(likedList, "flex");
	    showElement(avatar);
	    showElement(welcomeMsg);
	    // showElement(logoutBtn, 'inline-block');
	    // hideElement(loginForm);
	    // hideElement(registerForm);
		// hideElement(profileForm);
		// hideElement(recoList);

		console.log("retrieving liked job info..");
		console.log(result);
		console.log(result.length);

		if (result.length === 0)
			{
				// $("#likedList")
				console.log("Here")
				let title = $("<p> ");
				title.addClass("no-jobs")
				title.text("You do not have any liked jobs yet.")

				$("#likedList").append(title);
			}
		else{
		$("#likedList").append("<ul id='likedListUL' class='item-list'></ul>")
		$.each(result, function(index, val) {

		let listItem = $("<li>")
		listItem.addClass("item")
		// listItem.append("<i class='fa fa-heart fa-2x'</i>")

		let jobDiv = $("<div>")
		let jobName = $("<a>")
		jobName.addClass("job-item-name").attr("href", "#").attr("id", val["job_id"])

		let likeDiv = $("<div>")
		let likeDiveIcon = $("<i>")

		likeDiv.addClass("fav-link")

		likeDiveIcon.addClass("fa fa-heart").addClass('job-like-btn').attr("id", "icon_"+val["job_id"])
		likeDiv.append(likeDiveIcon)

		jobName.text(val["title"] + ' - ' + val["company"])
		jobDiv.append(jobName)

		listItem.append(jobDiv)
		listItem.append(likeDiv)
		console.log(listItem);

		$("#likedListUL").append(listItem);

			// console.log(val);

		})


		$('.job-like-btn').on('click', RemoveLikedJob);
		$('.job-item-name').on('click', getJobInformation);
		// document.querySelector('.job-item-name').addEventListener('click', getJobInformation);

	}
}
