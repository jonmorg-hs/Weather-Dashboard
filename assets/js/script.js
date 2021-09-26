
var wpid, lat, lng;

var cities = [];

var units = [{'unit':'metric','degrees':'C','speed':'kph'},{'unit':'imperial','degrees':'F','speed':'mph'}];

if(localStorage.getItem('cities')==null){
cities = ['Austin','Chicago','New York','Orlando','San Francisco','Seattle','Denver','Atlanta'];
} else {
    //cities = ['Austin','Chicago','New York','Orlando','San Francisco','Seattle','Denver','Atlanta'];
    cities = JSON.parse(localStorage.getItem("cities"));    
}

if(localStorage.getItem("searchunit")==null){} else {
$('#searchunit').val(localStorage.getItem("searchunit"));
}


$("#citysearch").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        getLocationWeather();
    }
});

var unit = $("#searchunit").val();
var degrees, speed;

for(var i=0;i<units.length;i++){
    if(units[i]['unit']==unit){
    degrees = String.fromCharCode(176)+units[i]['degrees'];
    speed = units[i]['speed'];    
    }}

$("#searchunit").on('change', function () {
    localStorage.setItem("searchunit",$(this).val());
    for(var i=0;i<units.length;i++){
        if(units[i]['unit']==$(this).val()){
        degrees = String.fromCharCode(176)+units[i]['degrees'];
        speed = units[i]['speed'];    
        }}
    
    getFavoriteWeather($('#city').html());
});

getFavoriteWeather('Melbourne');

var searchbtn = document.getElementById("searchbtn");
searchbtn.addEventListener('click',getLocationWeather);



if (!!navigator.geolocation) {
wpid=navigator.geolocation.getCurrentPosition(getPosition, locError, {maximumAge:0, timeout:1000, enableHighAccuracy: true});
} else {
alert("Your browser does not support the Geolocation API");
}

function getPosition(position) {
lat = position.coords.latitude;
lng = position.coords.longitude;
}

function locError(){}

function getMyLocationWeather() {

    var requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lng+"&appid=67313a7465f37268318f91bd61d81546";
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
    }).then(function(data){
        showWeather(data);
    });
  }
 
  setTimeout(function(){
  getMyLocationWeather();
  },2000);

function getLocationWeather() {
var city = document.getElementById("citysearch").value;
var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units="+unit+"&appid=67313a7465f37268318f91bd61d81546";
fetch(requestUrl)
  .then(function (response) {
    if( !$.isArray(response)||!response.length ) {  
    alert('Not City Exists! Try Again.');
    $('#citysearch').val('');
    } else {  
    return response.json();
    }
}).then(function(data){
    showFavoriteWeather(data);
});
var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units="+unit+"&appid=67313a7465f37268318f91bd61d81546";
fetch(requestUrl)
  .then(function (response) {
    return response.json();
}).then(function(data){
    showForecast(data);
});; 
}

function getFavoriteWeather(city) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units="+unit+"&appid=67313a7465f37268318f91bd61d81546";
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
    }).then(function(data){
       showFavoriteWeather(data);
    });;
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units="+unit+"&appid=67313a7465f37268318f91bd61d81546";
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
    }).then(function(data){
        showForecast(data);
    });; 
}

for(var i=0;i<cities.length;i++){
var fav = "<div class='fav_btn' onclick=\"getFavoriteWeather('"+cities[i]+"')\">"+cities[i]+"</div>";    
$('#favorites_div').append(fav);
}

$('.fav_btn').mousedown(function(event) {
    switch (event.which) {
        case 1:
            break;
        case 2:
            break;
        case 3:
            var check = confirm("Do you want to remove "+$(this).html()+" from your favorites?");
            if(check){
                var cdata = [];
                for(var i=0;i<cities.length;i++){
                if(cities[i]==$(this).html()) {}  else {
                  cdata.push(cities[i]);  
                }  
            }
            cities=cdata;
            localStorage.setItem('cities',JSON.stringify(cities));
            $('#favorites_div').empty();
            for(var i=0;i<cities.length;i++){
                var fav = "<div class='fav_btn' onclick=\"getFavoriteWeather('"+cities[i]+"')\">"+cities[i]+"</div>";    
                $('#favorites_div').append(fav);
                }  
        } 
            break;
        default:
    }
});

function showWeather(data){
    var str = data['timezone'].split('/');
    $('#city').html(str[1]);
    $('#currentdate').html("("+moment.unix(data['current']['dt']).format("MM/DD/YYYY")+")");
    $('#currenticon').attr("src","https://openweathermap.org/img/wn/"+data['current']['weather'][0]['icon']+"@2x.png");
    $('#temp').html("Temp: "+data['current']['temp']+" "+degrees);
    $('#wind').html("Wind: "+data['current']['wind_speed']+" "+speed);
    $('#humidity').html("Humidity: "+data['current']['humidity']);
    if(data['current']['uvi']*1<3){
        $('#uvindex').html("UV Index: <div class='uv_favorable'>"+data['current']['uvi']+"</div>"); 
    } else {
    if(data['current']['uvi']*1<5){
        $('#uvindex').html("UV Index: <div class='uv_moderate'>"+data['current']['uvi']+"</div>"); 
    } else {       
    $('#uvindex').html("UV Index: <div class='uv_severe'>"+data['current']['uvi']+"</div>"); 
    }}
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?q="+str[1]+"&units="+unit+"&appid=67313a7465f37268318f91bd61d81546";
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
    }).then(function(data){
        showForecast(data);
    });;   
}

function showFavoriteWeather(data){
    for(var i=0;i<units.length;i++){
        if(units[i]['unit']==unit){
        var degrees = units[i]['degrees'];
        var speed = units[i]['speed'];    
        }}
    $('#city').html(data['name']);
    $('#currentdate').html("("+moment.unix(data['dt']).format("MM/DD/YYYY")+")");
    $('#currenticon').attr("src","https://openweathermap.org/img/wn/"+data['weather'][0]['icon']+"@2x.png");
    $('#temp').html("Temp: "+data['main']['temp']+" "+degrees);
    $('#wind').html("Wind: "+data['wind'].speed+" "+speed);
    $('#humidity').html("Humidity: "+data['main']['humidity']);
    if(data['main']['uvi']*1<3){
        $('#uvindex').html("UV Index: <div class='uv_favorable'>"+data['main']['uvi']+"</div>"); 
    } else {
    if(data['main']['uvi']*1<5){
        $('#uvindex').html("UV Index: <div class='uv_moderate'>"+data['main']['uvi']+"</div>"); 
    } else {       
    $('#uvindex').html("UV Index: <div class='uv_severe'>"+data['main']['uvi']+"</div>"); 
    }}
    getUVIndex(data['coord']['lat'],data['coord']['lon']);
    setTimeout(function(){
    if(cities.includes(data['name'])){} else {
    var check = confirm('Do you want to save this city to favourites?');
    if(check){
        cities.push(data['name']);
        localStorage.setItem('cities',JSON.stringify(cities));
        $('#favorites_div').empty();
        for(var i=0;i<cities.length;i++){
            var fav = "<div class='fav_btn' onclick=\"getFavoriteWeather('"+cities[i]+"')\">"+cities[i]+"</div>";    
            $('#favorites_div').append(fav);
            }  
    } 
}},5000);   
}

//use 15:00 as time for each days forecast
function showForecast(data){
    $('#forecast_days').empty(); 
    var day = 0; 
    var cdate = moment().add(day, 'days').format('YYYY-MM-DD');
    for(var i=0;i<data['list'].length;i++){ 
        if(data['list'][i]['dt_txt']==cdate+" 15:00:00"){ 
        var forecast_date = moment.unix(data['list'][i]['dt']).format("MM/DD/YYYY");    
        var html = "<div class='forecast' >";
        html += "<div class='day_forecast_date'>"+forecast_date+"</div>";
        html += "<div class='day_forecast'><img style='width:40px;height:40px' src='https://openweathermap.org/img/wn/"+data['list'][i]['weather'][0]['icon']+"@2x.png' /></div>";
        html += "<div class='day_forecast'>Temp: "+data['list'][i]['main']['temp']+" "+degrees+"</div>";
        html += "<div class='day_forecast'>Wind: "+data['list'][i]['wind']['speed']+" "+speed+"</div>";
        html += "<div class='day_forecast'>Humidity: "+data['list'][i]['main']['humidity']+"</div>";
        html += "</div>";
        $('#forecast_days').append(html); 
        day = day+1;
        cdate = moment().add(day, 'days').format('YYYY-MM-DD');
        }
    }
}

function getUVIndex(lat,lng){
    var requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lng+"&appid=67313a7465f37268318f91bd61d81546";
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
    }).then(function(data){
        showUVIndex(data);
    });   
}

function showUVIndex(data){
    if(data['current']['uvi']*1<3){
        $('#uvindex').html("UV Index: <div class='uv_favorable'>"+data['current']['uvi']+"</div>"); 
    } else {
    if(data['current']['uvi']*1<5){
        $('#uvindex').html("UV Index: <div class='uv_moderate'>"+data['current']['uvi']+"</div>"); 
    } else {       
    $('#uvindex').html("UV Index: <div class='uv_severe'>"+data['current']['uvi']+"</div>"); 
    }}    
}

