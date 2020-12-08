import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {BehaviorSubject} from 'rxjs';


export class Message{
  constructor(public content : String, public sentBy : String) {}
}


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  constructor() {}
  conversation = new BehaviorSubject<Message[]>([]);
  
  updateMessage(message:Message){
    this.conversation.next([message]);
  }

  converse(message:String){
    const userMessage = new Message(message, "user");
    if (message!=""){
      this.sendWeather(userMessage, message);
    }
  }

  sendWeather(userMessage : Message, message:String){
    const axios = require('axios').default;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${message}&APPID=550b02ddc09fdcdf3768ccd28259d097&units=metric`;
    axios.get(url)
    .then((res:any)=>{
      let weatherReport = `Weather for <b>${res.data.name}</b>.\nTemperature : <b>${res.data.main.temp}</b>\n
      Humidity : <b>${res.data.main.humidity}%</b>
      Desription : <b>${res.data.weather[0].description}</b>`;
      const botMessage = new Message(weatherReport, "bot");
      this.updateMessage(userMessage);
      this.updateMessage(botMessage);
      //console.log(res.data)
    })
    .catch((err:Error)=>{
      const botMessage = new Message(`No weather details found for <b>${message}</b>`, "bot");
      this.updateMessage(userMessage);
      this.updateMessage(botMessage);
      //console.log(err);
    })
  }
}
