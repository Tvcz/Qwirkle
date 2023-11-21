import net from 'net';

/**
 * A connection is a two-way communication channel between two endpoints.
 *
 * A connection can send messages to the other end of the connection, and can
 * receive messages from the other end of the connection.
 *
 * One connection instance should exist on the client, and a corresponding
 * instance should exist on the server for each connected client.
 */
export interface Connection {
  /**
   * Sends a message to the other end of the connection.
   * @param message the message to send
   */
  send(message: string): void;

  /**
   * Registers a callback to be called when a message is received from the other
   * end of the connection.
   * @param callback the function to be called with a received message
   */
  onResponse(callback: (message: string) => void): void;

  /**
   * Closes the connection.
   */
  close(): void;
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

  close(): void {
    this.socket.end();
  }
}
