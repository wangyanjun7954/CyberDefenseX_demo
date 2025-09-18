const redis = require("redis");

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
};
class PubSub {
  constructor({ blockchain }) {
    this.blockchain = blockchain;
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    // Connect both clients before using them
    this.publisher.connect().then(() => {
      // Publisher is ready
    });
    this.subscriber.connect().then(() => {
      // Subscribe after connection
      this.subscriber.subscribe(CHANNELS.TEST, (message) =>
        this.handleMessage(CHANNELS.TEST, message)
      );
      this.subscriber.subscribe(CHANNELS.BLOCKCHAIN, (message) =>
        this.handleMessage(CHANNELS.BLOCKCHAIN, message)
      );
    });
  }
  
  handleMessage(channel, message) {
    console.log(`Message recieved.Channel: ${channel} Message:${message}`);
    const parseMessage = JSON.parse(message);

    if (channel === CHANNELS.BLOCKCHAIN) {
      this.blockchain.replaceChain(parseMessage);
    }
  }
  publish({ channel, message }) {
    this.publisher.publish(channel, message);
  }
  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }
}

// const checkPubSub = new PubSub();
// setTimeout(
//   () => checkPubSub.publisher.publish(CHANNELS.TEST, "Hellloooo"),
//   1000
// );
module.exports = PubSub;
