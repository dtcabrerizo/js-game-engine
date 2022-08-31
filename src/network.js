

export class NetorkController {
    constructor() {
        this.peer = new Peer();
        this.conn = null;
        if (this.onConnection) this.peer.on('connection', this.onConnection.bind(this));

        this.peer.on('open', id => {
            console.debug('NetworkController - Connection open', id);
            this.id = id;
        });
        this.peer.on('disconnected', () => {
            console.debug('NetworkController - Connection lost');
            this.peer.reconnect();
        });
        this.peer.on('close', () => {
            console.debug('NetworkController - Connection destroyed');
            this.conn = null;
        });
        this.peer.on('error', err => console.error('NetworkController', err));
    }


}


export class Server extends NetorkController {
    constructor() {
        super();
        this.clients = [];
    }
    onConnection(c) {
        c.on('data', this.onData.bind(this, c));
        this.clients.push(c);
    }
    onData(client, data) {
        console.debug('Server received', data);
        if (this.handleData && typeof (this.handleData) == 'function') this.handleData(JSON.parse(data), client);
    }
    send(client, data) {
        client.send(JSON.stringify(data));
    }
    broadcast(data) {
        console.debug('Server sending', data);
        this.clients?.forEach(client => client.send(JSON.stringify(data)));
    }
}

export class Client extends NetorkController {
    constructor(gameId) {
        super();
        this.gameId = gameId;
    }

    connect() {
        this.conn = this.peer.connect(this.gameId);

        this.conn.on('open', () => {
            console.debug('NetworkController - Client - Connected to: ' + this.conn.peer);
        });
        this.conn.on('data', this.onData.bind(this));
        this.conn.on('close', () => {
            console.debug('NetworkController - Client - Lost connection, trying to reconnect...');
            this.connect();
        });
    }
    onData(data) {
        console.debug('Client received', data);
        if (this.handleData && typeof (this.handleData) == 'function') this.handleData(typeof data == 'object' ? data : JSON.parse(data));
    }
    send(data) {
        if (this.conn == null) return;
        this.conn.send(JSON.stringify(data));
    }

}