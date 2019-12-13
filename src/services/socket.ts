import * as io from 'socket.io-client';
import { ChatMessage } from '../types';
import { fromEvent, Observable } from 'rxjs';

export class SocketService {
  private socket: SocketIOClient.Socket = {} as SocketIOClient.Socket;

  public init(): SocketService {
    this.socket = io('https://localhost:8081/', {transports: ['websocket', 'polling', 'flashsocket']});
    return this;
  }

  public send(message: ChatMessage): void {
    this.socket.emit('message', message);
  }

  public onMessage(): Observable<ChatMessage> {
    return fromEvent(this.socket, 'message');
  }

  public disconnect(): void {
    this.socket.disconnect();
  }
}