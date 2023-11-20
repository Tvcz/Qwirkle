import StreamValues from 'stream-json/streamers/StreamValues';
import extractJson from './jsonParse';
import net from 'net';
import { xmap } from './jmapParser';
const host = '127.0.0.1';
const JSONStream = require('JSONStream');

// encompasses both information on how to send data (address, port, etc.)
// and how to address data (name of player)
export interface Connection {
  send(message: string): void;
  onResponse(callback: (message: string) => void): void;
}

export class TCPConnection implements Connection {
  private socket: net.Socket;

  constructor(socket: net.Socket) {
    this.socket = socket;
  }

  send(message: string): void {
    this.socket.write(message);
  }

  onResponse(callback: (message: string) => void): void {
    this.socket.on('data', (data) => {
      callback(data.toString());
    });
  }
}

process.stdin.pipe(JSONStream.parse()).on('data', (data: string) => {});

/**
 * Attaches the JSON parser and handler to the input stream.
 */
const main = () => {
  const portNumber = parseInt(process.argv[2], 10);
  const server = net.createServer();
  server.listen(portNumber, host, () => {
    console.log('TCP Server is running on port ' + portNumber + '.');
  });
  server.on('connection', function (sock) {
    const pipeline = sock.pipe(StreamValues.withParser());
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    pipeline.on('data', function (data) {
      // Write the data back to all the connected, the client will receive it as data from the server
      let extractedAnswer = extractJson(data.value);
      let joinedString = extractedAnswer.join(', ');
      sock.write(`${JSON.stringify(joinedString)}\n`);
    });
  });
};

function stdinStreamJson(jsonCallBack: (json: any) => any): void {
  const pipeline = process.stdin.pipe(StreamValues.withParser());
  pipeline.on('data', (data) => {
    return jsonCallBack(data.value);
  });
}

function xmapMain(): void {
  let jmap: any = null;
  process.stdin.pipe(StreamValues.withParser()).on('data', (data) => {
    data = data.value;
    const json = data;
    if (jmap !== null) {
      const jtile = json;
      const cookedValue = xmap(jmap, jtile);
      console.log(cookedValue);
      jmap = null;
    } else {
      jmap = json;
    }
  });
}

xmapMain();
