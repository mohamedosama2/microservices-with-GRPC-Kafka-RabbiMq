import { ClientOptions, Transport } from "@nestjs/microservices";

export const kafkaClientOptions: ClientOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'nestjs-client',
      brokers: ['localhost:9092'], // Replace with your Kafka broker addresses
    },
    consumer: {
      groupId: 'nestjs-group',
    },
  },
};
