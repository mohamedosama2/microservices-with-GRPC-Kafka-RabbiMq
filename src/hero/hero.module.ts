import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { HeroController } from "./controllers/hero.controller";
import {  KafkaController } from "./controllers/kafka.controller";
import { kafkaClientOptions } from "src/kafka-client.options";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "HERO_SERVICE",
        ...kafkaClientOptions,
      },
    ]),
  ],
  controllers: [HeroController, KafkaController],
})
export class HeroModule {}
