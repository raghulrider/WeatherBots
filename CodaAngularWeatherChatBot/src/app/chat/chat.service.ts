import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SyncRequestClient } from 'ts-sync-request/dist'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class Message {
  constructor(public content: string, public sentBy: string) { }
}

@Injectable()
export class ChatService {

  conversation = new BehaviorSubject<Message[]>([]);

  constructor() { }

  // Sends and receives messages via DialogFlow
  converse(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);
    console.log("User Message : "+msg);
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${msg}&APPID=550b02ddc09fdcdf3768ccd28259d097&units=metric`;
    try{
      let data: any = new SyncRequestClient().get(url);
      let temp = data.main.temp;
      let desc = data.weather[0].description;
      let humidity = data.main.humidity;
      let replyContent = `Weather in ${msg}\nTemperature : ${temp}°C\nHumidity : ${humidity}%\nDescription : ${desc}\n`;
      const botMessage = new Message(replyContent, 'bot');
      this.update(botMessage);
      console.log(botMessage);
    } catch (e) {
      console.log(e)
      const botMessage = new Message(`Sorry, couldn't find weather for "${msg}". ${e}`, 'bot');
      this.update(botMessage);
    }
  }
  // Adds message to source
  update(msg: Message) {
    this.conversation.next([msg]);
  }


}
