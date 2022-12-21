function getPoolData(){
	return {
			UserPoolId: "us-east-1_oIgN1J2cm",
			ClientId: "1f7es42bfr25h93ivmq2ok6ab9"
		};
}

var userPool;

var wallJobTags = [
	"Software Engineer",
	"Data Engineer",
	"Data Scientist",
	"Machine Learning Engineer",
	"Applied Scientist",
	"Product Manager",
	"Analyst",
	"Program Manager",
	"Cloud Engineer",
	"Site Reliability Engineer"
]

var dummyLikedJobs = [1,2,3]

var recosOptions = [
	"Based on your skills",
	"Based on users similar to you"
]

function getUserPool(){
	if (userPool===undefined){
		let poolData = getPoolData()
		console.log(poolData)
		userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
	};
	return userPool;
}

var cognitoUser;
var apigClient;

function getUser(userName){
	if (cognitoUser===undefined){
	    var userData = {
	        Username : userName,
	        Pool : getUserPool()
	        };
    	cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	}
	return cognitoUser;
}

function getBinary(file){
    return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = error => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
      if ((encoded.length % 4) > 0) {
        encoded += '='.repeat(4 - (encoded.length % 4));
      }
      resolve(encoded);
    };
    reader.onerror = error => reject(error);
  });
}


function wrapCallback(callback){
	return {
			onFailure: (err)=>{callback(err, null);},
			onSuccess: (result)=>{callback(null, result);}
		};
}

var loginForm;
var registerForm;
var profileForm;
var itemNav;
var itemList;
var innerMainContainer;
var jobTags;
var jobList;
var jobInformation;
var avatar;
var welcomeMsg;
var logoutBtn;
var likedList;
var recoList;

(function(){
	function init(){
			apigClient = apigClientFactory.newClient({});
		 	document.querySelector('#login-form-btn').addEventListener('click', onSessionInvalid);
		    document.querySelector('#login-btn').addEventListener('click', login);
		    document.querySelector('#register-form-btn').addEventListener('click', showRegisterForm);
			document.querySelector('#update-profile-btn').addEventListener('click', updateProfile);
		    document.querySelector('#register-btn').addEventListener('click', register);
		    document.querySelector('#nearby-btn').addEventListener('click', createWallOfJobs);
		    document.querySelector('#fav-btn').addEventListener('click', createProfileView);
		    document.querySelector('#recommend-btn').addEventListener('click', getUserLikedJobs);
			document.querySelector('#recommend-btn-2').addEventListener('click', RecommendedJobsNew);
			document.querySelector('#logout-link').addEventListener('click', onSessionInvalid);

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

		    validateSession();


}

	function validateSession(){

		let stored = window.localStorage.getItem('username')

		if (stored === null)
		{
			onSessionInvalid();
		}
		else
		{
			onSessionValid(stored);
		}
	}


	function onSessionValid(username) {
		cognito_user = getUser(username)
		window.localStorage.setItem('username', username)
		window.localStorage.setItem('user_id', username.split('@')[0])
		console.log(cognito_user);
	    user_id = username;

	    welcomeMsg.innerHTML = 'Welcome, ' +  window.localStorage.getItem('user_id');

	    showElement(itemNav);
		showElement(innerMainContainer);
	    showElement(jobTags, "flex");
		hideElement(jobList);
		hideElement(jobInformation);
	    showElement(avatar);
	    showElement(welcomeMsg);
	    showElement(logoutBtn, 'inline-block');
	    hideElement(loginForm);
	    hideElement(registerForm);
		hideElement(profileForm);
		hideElement(likedList);
		hideElement(recoList);

		RecommendedJobsNew();
	  }


	function getListJobsForTag()
	{
		console.log("get list jobs for tag");
		let jobTagForGet = $(this).text()
		console.log($(this))
		console.log($(this).text())
		console.log(jobTagForGet);

		let body = { }

		let params = { "tag": jobTagForGet }

		let additionalParams = { }

		apigClient.searchjobbytagGet(params, body, additionalParams).then(function(result)
		{
			console.log(result);
			console.log("API to get jobs by tag..");
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


	function ChangeLikedJob()
	{
		console.log("likeJob");
		let heartSymbol = $(this).attr('class');
		let jobid = $(this).attr('id').split('_')[1];

		if(heartSymbol.includes('fa-heart-o'))
		{
			$(this).removeClass('fa-heart-o').addClass('fa-heart')
			let body = { }

			let params = { "jobid": jobid, "userid": window.localStorage.getItem('user_id')}

			let additionalParams = { }

			apigClient.likejobPut(params, body, additionalParams).then(function(result)
			{
				console.log(result);
			}).catch(function(res) {
				console.log(res);
			})
		}
		else{

			$(this).removeClass('fa-heart').addClass('fa-heart-o')

			let body = { }

			let params = { "jobid": jobid, "userid": window.localStorage.getItem('user_id')}

			let additionalParams = { }

			apigClient.unlikejobPut(params, body, additionalParams).then(function(result)
			{
				console.log(result);

			}).catch(function(res) {
				console.log(res);
			})
		}

	}




	function createWallOfJobs()
	{
		console.log("create wall");

		$("#jobWallLeft").empty()
		$("#jobWallRight").empty()
		$("#jobList").empty()
		$("#likedList").empty()
		$("#recoList").empty()
		$("#jobInformation").empty()

		showElement(itemNav);
	    hideElement(jobList);
		showElement(jobTags, "flex");
		hideElement(jobInformation);
	    showElement(avatar);
	    showElement(welcomeMsg);
	    showElement(logoutBtn, 'inline-block');
	    hideElement(loginForm);
	    hideElement(registerForm);
		hideElement(profileForm);
		hideElement(likedList);
		hideElement(recoList);


		$("#jobWallLeft").append("<ul id='jobWallLeftList' class='item-list'></ul>")
		$("#jobWallRight").append("<ul id='jobWallRightList' class='item-list'></ul>")
		$.each(wallJobTags, function(index, val)
		{
			let listItem = $("<li>")
			listItem.addClass("item")
			listItem.append("<i class='fa fa-terminal fa-2x'></i>")
			let jobTag = $("<div>")
			let jobTagLink = $("<a>")
			jobTagLink.addClass("wall-item-name").attr("href", "#")
			jobTagLink.text(val)
			jobTag.append(jobTagLink)
			listItem.append(jobTag)
			console.log(listItem);

			if (index % 2 === 0)
			{
				$("#jobWallLeftList").append(listItem)
			}
			else {
				$("#jobWallRightList").append(listItem)
			}
		})

		$('.wall-item-name').on('click', getListJobsForTag);
	}

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

	function getJobInformation() {
		console.log("get job info");
		let jobId = $(this).attr("id")
		console.log('JobId', jobId)
		let body = { }

		let params = { "id": jobId }

		let additionalParams = { }
		console.log("here")
		apigClient.viewjobGet(params, body, additionalParams).then(function(result)
		{
			console.log(result);
			listJobInformation(result)
		}).catch(function(res) {
			console.log(res);
		})
	}

	function sendEmail(jobInformationData) {
		console.log("Entered");
		let params = {"job_id": jobInformationData["job_id"], "user_id": window.localStorage.getItem('user_id'), "email_id" : $("#email").val()}

		let additionalParams = { }

		let body = { }
		apigClient.sendemailPut(params, body, additionalParams).then(function(result)
		{
			console.log("Entered");
		}).catch(function(res) {
			console.log(res);
		})
		return false;
	}

	function listJobInformation(result)
	{
		let jobInformationData = result['data']

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
	    hideElement(loginForm);
	    hideElement(registerForm);
		hideElement(profileForm);
		hideElement(likedList);
		hideElement(recoList);

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


	function createProfileView()
	{
		let body = { }
		let params = {"userid": window.localStorage.getItem('user_id')}
		let additionalParams = { }

		apigClient.viewuserdetailsGet(params, body, additionalParams).then(function(result)
		{
			console.log("API to get user profile")
			renderProfile(result['data'])

		}).catch(function(res) {
			console.log(res);
		})
	}

	function editProfile()
	{
		let body = { }
		let params = {"userid": window.localStorage.getItem('user_id')}
		let additionalParams = { }

		apigClient.viewuserdetailsGet(params, body, additionalParams).then(function(result)
		{
			console.log("API to get user profile")
			let profile = result['data']

			let int_roles = $("#roles-select").val()
			let skills = $("#skills-select").val()

			profile['interested_roles'] = int_roles
			profile['skills'] = skills

			let params2 = { }

			let additionalParams2 = {
			   headers: {
				   'Content-Type':"application/json"
			   }
			}

			apigClient.putdetailsPut(params2, profile, additionalParams2).then(function(result2)
			{
				console.log(result2);
				createProfileView()
			}).catch(function(res2) {
				console.log(res2);
			})


		}).catch(function(res) {
			console.log(res);
		})
	}

	function uploadResumeToS3()
	{
		let file = document.getElementById('resume-file-input').files[0];
		if (file == undefined)
		{
	        return;
	    }

		let blob = file.slice(0, file.size, file.type);

		let newFile = new File([blob], window.localStorage.getItem('user_id')+'.jpeg', {type: 'image/jpeg'});

		let labels = [window.localStorage.getItem('user_id')]


		let fl = getBase64(newFile).then(
			data => {

		        let body = data;
		        let params = {"object" : newFile.name, 'Content-Type': newFile.type, 'x-amz-meta-customLabels': labels, 'folder': 'ccbd-resumes'};
		        let additionalParams = {};

				console.log(body);
				console.log(params);
		        apigClient.uploadresumeFolderObjectPut(params, body , additionalParams).then(function(res){
		        	if (res.status == 200) {
						console.log("upload success");
		            	createProfileView()
		        	}
		      	}).catch(function(res) {
					console.log(res);
				})
	    	}
		)

	}

	function renderProfile(profile)
	{
		$("#jobWallLeft").empty()
		$("#jobWallRight").empty()
		$("#jobList").empty()
		$("#likedList").empty()
		$("#recoList").empty()
		$("#jobInformation").empty()

		showElement(itemNav);
	    showElement(jobTags, "flex");
		hideElement(jobList);
		hideElement(jobInformation);
	    showElement(avatar);
	    showElement(welcomeMsg);
	    showElement(logoutBtn, 'inline-block');
	    hideElement(loginForm);
	    hideElement(registerForm);
		hideElement(profileForm);
		hideElement(likedList);
		hideElement(recoList);

		console.log(profile);

		let name_dp_div = $("<div>")
		name_dp_div.attr("id", "profile-name-dp")
		let dp = $("<img src='https://www.pngall.com/wp-content/uploads/5/Profile-PNG-Images.png' width='200' height='200'>")
		let dp_cont = $("<center>")
		dp_cont.append(dp)
		name_dp_div.append(dp_cont)
		let user_fullname = profile['first_name'] + ' ' + profile['last_name']
		let name_span = $("<span>")
		name_span.text(user_fullname)
		name_dp_div.append(name_span)
		name_dp_div.append($("<br>"))
		let major_span = $("<span>")
		major_span.attr("id", "profile-major-span")
		major_span.text(profile['degree'])
		name_dp_div.append(major_span)

		$("#jobWallLeft").append(name_dp_div)

		let about_div = $("<div>")
		about_div.attr("id", "profile-about-info")
		about_div.append($("<span style='font-weight: bold'>Email</span>"))
		let email_span = $("<span>")
		email_span.text(" | " + profile['email_id'])
		about_div.append(email_span)
		about_div.append($("<br>"))
		about_div.append($("<br>"))
		about_div.append($("<span style='font-weight: bold'>Degree Level</span>"))
		let deg_span = $("<span>")
		deg_span.text(" | " + profile['highest_degree'])
		about_div.append(deg_span)
		about_div.append($("<br>"))
		about_div.append($("<br>"))
		about_div.append($("<span style='font-weight: bold'>Graduation year</span>"))
		let yr_span = $("<span>")
		yr_span.text(" | " + profile['graduation_year'])
		about_div.append(yr_span)
		about_div.append($("<br>"))
		about_div.append($("<br>"))
		about_div.append($("<span style='font-weight: bold'>Interested in</span>"))

		let roles = profile['interested_roles'].join()
		let int_roles_input = $("<input style='width:50%; margin-left:10px;' type='text' value='" + roles + "' id='roles-select' />")
		about_div.append(int_roles_input)
		about_div.append($("<br>"))
		about_div.append($("<br>"))
		about_div.append($("<button style='float: right;' type='button' class='btn btn-warning' id='prof-edit-profile-btn'>Update Profile</button>"))

		$("#jobWallLeft").append(about_div)



		let resume_top_div = $("<div>")
		resume_top_div.attr("id", "profile-resume-top-div")
		resume_top_div.text("Your current resume is displayed below -")

		$("#jobWallRight").append(resume_top_div)

		let resume_disp_box = $("<div>")
		resume_disp_box.attr("id", "resume-display-box")
		let resume_preview = $("<img>")
		resume_preview.attr("src", "https://ccbd-resumes.s3.us-east-1.amazonaws.com/" + window.localStorage.getItem('user_id') + ".jpeg")
		resume_preview.attr("alt", "No resume found")
		resume_disp_box.append(resume_preview)

		$("#jobWallRight").append(resume_disp_box)

		let resume_drop_div = $("<div>")
		resume_drop_div.attr("id", "profile-resume-drop")
		resume_drop_div.append($("<form class='form-inline' id='upload-form'><span style='margin-right: 5px;'>Upload your resume - </span><input id='resume-file-input' type='file' class='form-control'/><button id='resume-upload-button' type='button' class='btn btn-warning'>Upload</button></form>"))

		$("#jobWallRight").append(resume_drop_div)
		$("#resume-upload-button").on('click', uploadResumeToS3)

		let skills_div = $("<div>")
		skills_div.attr("id", "profile-skills-box")
		skills_div.append("<center><h6>SKILLS</h6></center>")
		//let skills_select = $("<select multiple data-role='tagsinput' id='skills-select'></select>")
		let skills_str = profile['skills'].join()
		let skills_select = $("<input style='width:100%;' type='text' value='" + skills_str + "' id='skills-select' />")
		// $('#skills-select').tagsinput()
		// $.each(profile['skills'], function(index, val) {
		// 	console.log(val);
		// 	$("#skills-select").tagsinput(val)
		// })
		skills_div.append(skills_select)

		$("#jobWallRight").append(skills_div)

		$("#prof-edit-profile-btn").on('click', editProfile)
	}

	//get list of liked_jobs by user_id
	function getUserLikedJobs()
	{
		console.log("list liked");

		let body = { }

		let params = {"userid": window.localStorage.getItem('user_id')}

		let additionalParams = { }

		apigClient.viewuserdetailsGet(params, body, additionalParams).then(function(result)
		{
			console.log(result);
			let data = result["data"];
			let li = data["liked_jobs"];
			console.log(li);

			getJobDetailsfromUserLiked(li);

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

	function RemoveLikedJob()
	{
		console.log("likeJob");
		let heartSymbol = $(this).attr('class');
		let jobid = $(this).attr('id').split('_')[1];
		let body = { }

		let params = { "jobid": jobid, "userid": window.localStorage.getItem('user_id')}

		let additionalParams = { }

		apigClient.unlikejobPut(params, body, additionalParams).then(function(result)
		{
			console.log(result);
			getUserLikedJobs();

		}).catch(function(res) {
			console.log(res);
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
	    showElement(logoutBtn, 'inline-block');
	    hideElement(loginForm);
	    hideElement(registerForm);
		hideElement(profileForm);
		hideElement(recoList);

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


		let divItem2 = $("<div>")
		divItem2.addClass("card")
		divItem2.append("<img src='collab.jpg' alt='Collab' style='width:30%'>")
		let divItemInner2 = $("<div>")
		divItemInner2.addClass("cont")
		divItemInner2.append("<h4><b>Based on users similar to you </b></h4>").addClass("collab-based").attr("href", "#")
		divItemInner2.append("<p>These are jobs recommended for you based on skills you provided as well as skills extracted from your resume. Check them out!</p>")

		divItem2.append(divItemInner2)

		$("#jobWallRight").append(divItem2);


		$('.content-based').on('click', getContentBasedRecommendedJobs);
		$('.collab-based').on('click', getCollabRecommendedJobs);

	}


	function getContentBasedRecommendedJobs()
	{
		console.log("Content Based Recommendations...");
		let body = { }

		let params = {"userid": window.localStorage.getItem('user_id')}

		let additionalParams = { }

		apigClient.getcontentbasedrecosGet(params, body, additionalParams).then(function(result)
		{
			console.log(result);
			let data = result["data"];

			console.log(data);

			getJobDetailsfromUserRecos(data);

		})
	}

	function getCollabRecommendedJobs()
	{
		console.log("Collaborative Recommendations...");
		let body = { }

		let params = {"userid": window.localStorage.getItem('user_id')}

		let additionalParams = { }

		apigClient.getcollaborativerecosGet(params, body, additionalParams).then(function(result)
		{
			console.log(result);
			let data = result["data"];

			console.log(data);

			getJobDetailsfromUserRecos(data);

		})
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

	function onSessionInvalid(){

		console.log("Hiding elements");
		hideElement(itemNav);
		hideElement(innerMainContainer);
	    hideElement(jobTags);
		hideElement(jobList);
		hideElement(jobInformation);
	    hideElement(avatar);
	    hideElement(welcomeMsg);
	    hideElement(logoutBtn);
	    hideElement(loginForm);
	    hideElement(registerForm);
		hideElement(profileForm);

	    clearLoginError();
		$('#jobWallLeft').empty()
		$('#jobWallRight').empty()
		$('#jobList').empty()
		$('#jobInformation').empty()
		window.localStorage.removeItem('username')
		console.log("Showing login form");
	    showElement(loginForm);
	}

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

	function showRegisterForm() {

		hideElement(itemNav);
		hideElement(innerMainContainer);
	    hideElement(jobTags);
		hideElement(jobList);
		//hideElement(jobInformation);
	    hideElement(avatar);
	    hideElement(welcomeMsg);
	    hideElement(logoutBtn);
	    hideElement(loginForm);
	    hideElement(registerForm);
		hideElement(profileForm);

	    clearRegisterResult();
		clearProfileResult();
	    showElement(registerForm);
	  }

	  function showProfileForm() {

		hideElement(itemNav);
  		hideElement(innerMainContainer);
  	    hideElement(jobTags);
  		hideElement(jobList);
		//hideElement(jobInformation);
  	    hideElement(avatar);
  	    hideElement(welcomeMsg);
  	    hideElement(logoutBtn);
  	    hideElement(loginForm);
  	    hideElement(registerForm);
  		hideElement(profileForm);

		clearRegisterResult();
		clearProfileResult();
  	    showElement(profileForm);
  	  }

         function register() {
     		var username = document.querySelector('#register-username').value;
     		var password = document.querySelector('#register-password').value;

     		if (username === "" || password == "") {
     			showRegisterResult('Please fill in all fields');
     			return
     		}

			

			let dataEmail = {
			    Name : 'email',
			    Value : username
			}

			let attributeList = [ new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail)]

			let userPool = getUserPool();

			userPool.signUp(username, password, attributeList, null, function(err, result){
			    if (err) {
			    	showRegisterResult('Failed to register');
			    }
			    else {
			    	cognitoUser = result.user;
					console.log(cognitoUser);
					showProfileForm()
			    	//showRegisterResult('Succesfully registered');
			    }
			});
     	}

		function updateProfile() {
		   let verif_code = document.querySelector('#profile-verif-code').value;
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
		   console.log(verif_code);

		   getUser(cognitoUser['username']).confirmRegistration(verif_code, true, function(err, verres) {
			   if (err)
			   {
				   showProfileResult("Failed to verify")
				   console.log(err);
			   }
			   else
			   {
				   apigClient.putdetailsPut(params, reqBody, additionalParams).then(function(result)
				   {
					   console.log(result);
					   showProfileResult('Succesfully registered');
				   }).catch(function(res) {
					   console.log(res);
					   showProfileResult('Failed to register');
				   })
			   }
		   })

	   }

     	function showRegisterResult(registerMessage) {
     		document.querySelector('#register-result').innerHTML = registerMessage;
     	}

     	function clearRegisterResult() {
     		document.querySelector('#register-result').innerHTML = '';
     	}

		function showProfileResult(registerMessage) {
     		document.querySelector('#profile-result').innerHTML = registerMessage;
     	}

     	function clearProfileResult() {
     		document.querySelector('#profile-result').innerHTML = '';
     	}




	init();
})();
