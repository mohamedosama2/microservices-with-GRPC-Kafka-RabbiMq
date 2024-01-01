import { ClientOptions, Transport } from "@nestjs/microservices";

export const kafkaClientOptions: ClientOptions = {
  transport: Transport.RMQ,
  options: {
    urls: ["amqps://rakucgag:dtRhlnG8gG-rBKUYOVK-7HSckB5-3EZm@jackal.rmq.cloudamqp.com/rakucgag"],
    queue: "cats_queue",
    queueOptions: {
      durable: false,
    },
  },
};
