//// getting current location and Weather data
var latitude;
var longitude;
var apiKey = "0b9aa1ce15a36848a7fce495b9f3008c";
const preLoader = document.querySelector(".pre-loader");

navigator.geolocation.getCurrentPosition( (position)=>{	

	//getting latitude and lo/gitude
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;

	//fethcing Location data
	fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
    .then( res=>{
    	res.json()
    	.then(data=>{
    		//console.log(data);\
    		const temp = data.main.temp;
    		const city = data.name;
    		const dsc = data.weather[0].main;
    		const wind = data.wind.speed;
    		//console.log(temp,city,dsc,wind);

    		document.querySelector("header h1 span").textContent = city;
    		document.querySelector("header h2 .temp").textContent = Math.round(temp - 273);
    		document.querySelector("header .right .weather-info .dsc").textContent = dsc;
    		document.querySelector("header .right .weather-info .wind").textContent = `${wind} km/h`;
    	})
    	.catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})

// set date and greeting in the app as the user's system
const months = ["January","February","March","April","May","June","July","September","October","November","December"];
const dateSpan = document.querySelector(".dateTime-info .date");
const date = new Date;
const hour = date.getHours();
var msg;

//console.log(date,hour)
if (hour>=0 && hour<6) {
	msg = "Morning, sun shine!"
}else if (hour>=6 && hour<12) {
	msg = "Good Morning!"
}else if (hour>=12 && hour<16) {
	msg = "Good Afternoon!"
}else if (hour>=16 && hour<=20) {
	msg = "Good Evening!"
}else{
	msg = "Good Night!"
}
 
document.querySelector(".greeting").textContent = msg;
dateSpan.textContent = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;

// set time in the app as the user's system
function setTime(){
	const timeSpan = document.querySelector(".dateTime-info .time");
	const date = new Date;

	timeSpan.textContent = date.toLocaleTimeString();

	setTimeout( ()=>{
		setTime()
	},1000)
}
setTime()

//get News articles
var post;
var index = 0;

function getAttricles(code){

	
	preLoader.style.display = "block";
	fetch(`https://newsapi.org/v2/top-headlines?country=${code}&apiKey=85b80ca867544dc98b496c36b999f0fa`)
    .then(res=>{
    	res.json()
    	.then(data=>{
			
			preLoader.style.display = "none";
			post = data.articles;
			//console.log(post);
		    putArticles(index);
    	})
    	.catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
}
getAttricles("us");

function putArticles(index1){

	  //disbale next buttun on reaching last article
	if (index1 >= 20){
		document.querySelector("#NextPost").setAttribute("disabled","");
		index = 19;
		return;
	}else{
		document.querySelector('#NextPost').removeAttribute('disabled');
	}

	//disbale prev buttun on first article
	if(index1 <= -1){
		document.querySelector('#prePost').setAttribute('disabled','');
		index = 0;
		return;
	}else{
		document.querySelector('#prePost').removeAttribute('disabled');
	}


	const postInd = post[index1];

	if(postInd.urlToImage){

		 //add loading image
		document.querySelector("article img").src = "Images/load.svg";
		let img = document.createElement("img");
		img.src = postInd.urlToImage;
		img.onload = ()=>{
			document.querySelector("article img").src = postInd.urlToImage;
		}
		
	}else{
		document.querySelector("article img").src ='Images/default.png';
	}
	
	document.querySelector("article h2").innerHTML = postInd.title;
	document.querySelector("article p").innerHTML = postInd.description;
	document.querySelector("article em").textContent = postInd.author;
	document.querySelector("article a").href = postInd.url;
}

// next Btn for next post
document.querySelector("#NextPost").onclick = ()=>{
	index++;
	putArticles(index);
}

// previous btn for previous post
document.querySelector('#prePost').onclick = ()=>{
    index--;
    putArticles(index);
}

// get articles by country name
const dataCode = document.querySelectorAll("[data-code]");
dataCode.forEach( (span)=>
	{
		span.onclick = ()=>{

			//set background color black to Btn for selected country
			dataCode.forEach( (sp)=>{
				if(span == sp){
					sp.setAttribute("active","")
				}else{
					sp.removeAttribute("active")
				}
			})
			//console.log("clicked")
			let code1 = span.getAttribute("data-code");
			getAttricles(code1);
			index = 0;
		}
	})

	// adding touch event
	let start;
	let end;
	
	window.addEventListener("touchstart",(e)=>{
		//console.log('touched start');
		start = e.changedTouches[0].clientX;
	})
	window.addEventListener("touchend",(e)=>{
		//console.log('touched end');
		end = e.changedTouches[0].clientX;
		if (Math.abs(start - end)>= 20){
			if(start > end){

				//left swipe
				//console.log("left swipe")
				index++;
	            putArticles(index);

			}else{
				// right swipe
				//console.log("right swipe")
				index--;
	            putArticles(index);
			}
		}
	})