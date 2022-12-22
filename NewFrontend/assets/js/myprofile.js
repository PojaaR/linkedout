var apigClient;
var username;
window.localStorage.setItem('user_id','am11449');

document.querySelector('#fav-btn').addEventListener('click', createProfileView);

welcomeMsg = document.querySelector('#welcome-msg');
itemNav = document.querySelector('#item-nav');  
avatar = document.querySelector('#avatar');
logoutBtn = document.querySelector('#logout-link');

apigClient = apigClientFactory.newClient({});

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

function createProfileView()
{
    let body = { }
    let params = {"userid": window.localStorage.getItem('user_id')}
    let additionalParams = { }
    let profile = {
        "first_name": "Atul",
        "last_name": "Manjunath Bharadwaj",
        "degree": "Masters",
        "highest_degree": "Bachelors",
        "graduation_year": "2023",
        "interested_roles": ["SDE", "BA"],
        "skills": ["Python", "Data Science"]
    }

    // apigClient.viewuserdetailsGet(params, body, additionalParams).then(function(result)
    // {
    //     console.log("API to get user profile")
        
    //     renderProfile(result['data'])

    // }).catch(function(res) {
    //     console.log(res);
    // })

    renderProfile(profile);
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
		        let params = {"object" : newFile.name, 'Content-Type': newFile.type, 'x-amz-meta-customLabels': labels, 'folder': 'linkedout-resumestore2'};
		        let additionalParams = {};

				console.log(body);
				console.log(params);
		        apigClient.postresumeFolderFilePut(params, body , additionalParams).then(function(res){
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
    // $("#jobList").empty()
    // $("#likedList").empty()
    // $("#recoList").empty()
    // $("#jobInformation").empty()

    showElement(itemNav);
    // showElement(jobTags, "flex");
    // hideElement(jobList);
    // hideElement(jobInformation);
    showElement(avatar);
    showElement(welcomeMsg);
    showElement(logoutBtn, 'inline-block');
    // hideElement(loginForm);
    // hideElement(registerForm);
    // hideElement(profileForm);
    // hideElement(likedList);
    // hideElement(recoList);

    console.log(profile);
    console.log("Inside Render");

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
    // about_div.append($("<span style='font-weight: bold'>Email</span>"))
    // let email_span = $("<span>")
    // email_span.text(" | " + profile['email_id'])
    // about_div.append(email_span)
    // about_div.append($("<br>"))
    // about_div.append($("<br>"))
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
    resume_preview.attr("src", "https://linkedout-resumestore2.s3.amazonaws.com/" + window.localStorage.getItem('user_id') + ".jpeg")
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