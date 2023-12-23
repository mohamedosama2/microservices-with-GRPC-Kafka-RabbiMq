import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { grpcClientOptions } from "../grpc-client.options";
import { HeroController } from "./controllers/hero.controller";
import { GrpcController } from "./controllers/grpc.controller";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "HERO_PACKAGE",
        ...grpcClientOptions,
      },
    ]),
  ],
  controllers: [HeroController, GrpcController],
})
export class HeroModule {}
