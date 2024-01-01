import { Controller, Inject, OnModuleInit } from "@nestjs/common";
import { ClientKafka, ClientRMQ, MessagePattern } from "@nestjs/microservices";
import { HeroById } from "../interfaces/hero-by-id.interface";
import { Hero } from "../interfaces/hero.interface";

@Controller()
export class RabbitController implements OnModuleInit {
  constructor(@Inject("HERO_SERVICE") private readonly client: ClientRMQ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @MessagePattern("Fetch-All-Heros")
  async getMany(data: HeroById): Promise<Hero[]> {
    // Your logic to fetch heroes based on the received data
    const heroes: Hero[] = [
      { id: 1, name: "John" },
      { id: 2, name: "Doe" },
    ];
    
    return heroes;
  }
}
