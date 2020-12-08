import { ChatService, Message } from './../chat.service';
import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {scan} from 'rxjs/operators';
@Component({
  selector: 'chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css']
})
export class ChatDialogComponent implements OnInit {

  messages : any | Observable<Message[]>;
  formValue : any | String;
  constructor(private chat : ChatService) { }

  ngOnInit(){
    this.messages = this.chat.conversation.asObservable()
    .pipe(scan((acc,val)=> acc.concat(val)));
  }

  getWeather(){
    this.chat.converse(this.formValue);
    this.formValue = "";
  }

}
