import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { HeroController } from "./controllers/hero.controller";
import { kafkaClientOptions } from "src/rabbit-client.options";
import { RabbitController } from "./controllers/rabbit.controller";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "HERO_SERVICE",
        ...kafkaClientOptions,
      },
    ]),
  ],
  controllers: [HeroController, RabbitController],
})
export class HeroModule {}
