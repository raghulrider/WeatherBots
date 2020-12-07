const express = require('express');
const app = express();
const dfff = require('dialogflow-fulfillment');
const request = require("sync-request");
const path = require("path");


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});

//webhook for dialogflow
app.post("/", express.json(), (req, res) => {
    const agent = new dfff.WebhookClient({
        request: req,
        response: res
    });

    function sendWeather(agent) {
        let place = agent.context.get("awaiting_placename").parameters["geo-city.original"];
        if (place === "") {
            place = agent.context.get("awaiting_placename").parameters["geo-country.original"];
        }
        console.log(`New Request : ${place}`);
        if (place === "") {
            agent.add("Please provide me with some place name.")
        } else {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${place}&APPID=550b02ddc09fdcdf3768ccd28259d097&units=metric`;
            let res = request('GET', url, {
                headers: {
                    'Content-type': 'application/json',
                },
            });
            let body = JSON.parse(res.getBody());
            console.log(body);
            if (body.cod === 200) {
                let temp = body.main.temp;
                let pressure = body.main.pressure;
                let humidity = body.main.humidity;
                let desc = body.weather[0].description;
                //let resp = `Weather in ${place}\nTemperature : ${temp}°C\nPressure : ${pressure}\nHumidity : ${humidity}\nDescription : ${desc}\n`;
                //agent.add(resp);
                let customPayload = {
                    "richContent": [
                        [
                            {
                                "type": "description",
                                "title": `Weather in ${place}`,
                                "text": [
                                    `Temperature : ${temp}°C`,
                                    `Pressure : ${pressure}`,
                                    `Humidity : ${humidity}%`,
                                    `Description : ${desc}`
                                ]
                            }
                        ]
                    ]
                }
                agent.add(new dfff.Payload(agent.UNSPECIFIED, customPayload, { sendAsMessage: true, rawPayload: true }));

            } else {
                agent.add(`Weather results for ${place} is not found.`);
            }

        }

    }

    let intentMap = new Map();
    intentMap.set("sendWeather", sendWeather);
    agent.handleRequest(intentMap);
});

app.listen(3333, () => console.log("Weather bot running at port 3333"));