document.getElementById("inputBox").addEventListener("keyup", function (event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    //user-message
    let msg = document.getElementById("inputBox").value;
    let div = document.createElement("div");
    div.className = "message-user";
    div.innerHTML = msg;
    document.getElementById("chat").appendChild(div);

    //bot-message
    let div = document.createElement("div");
    div.className = "message-bot";
    let xmlHttp = new XMLHttpRequest();
    url = `https://api.openweathermap.org/data/2.5/weather?q=${msg}&APPID=550b02ddc09fdcdf3768ccd28259d097&units=metric`;
    xmlHttp.open("GET", url, false)
    xmlHttp.send(null);
    let data = JSON.parse(xmlHttp.responseText);
    let response = "";
    if (data.cod === 200) {
      response = `<b>Weather for ${msg}</b><br><br>Temperature : <b>${data.main.temp}°C</b><br>Humidity : <b>${data.main.humidity}</b><br>Description : <b>${data.weather[0].description}</b>`
    } else {
      response = `Weather results for "${msg}" is not found.`
    }
    div.innerHTML = response;
    document.getElementById("chat").appendChild(div);
    document.getElementById("inputBox").value = "";
    var objDiv = document.getElementById("chat");
    objDiv.scrollTop = objDiv.scrollHeight;
  }
});
