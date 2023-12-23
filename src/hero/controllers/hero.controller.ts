import { Controller, Get, OnModuleInit } from "@nestjs/common";
import { Client, ClientKafka, Transport } from "@nestjs/microservices";
import { Observable, Subject } from "rxjs";
import { HeroById } from "../interfaces/hero-by-id.interface";
import { Hero } from "../interfaces/hero.interface";
import { first, toArray } from "rxjs/operators";
import { kafkaClientOptions } from "src/kafka-client.options";

@Controller("hero")
export class HeroController implements OnModuleInit {
  private readonly items: Hero[] = [
    { id: 1, name: "John" },
    { id: 2, name: "Doe" },
  ];

  @Client(kafkaClientOptions)
  client: ClientKafka;

  async onModuleInit() {
    this.client.subscribeToResponseOf("Fetch-All-Heros");
    await this.client.connect();
  }

  @Get()
  async getMany() {
    console.log("Hello");
    const requestTopic = "Fetch-All-Heros";
    const responseTopic = `${requestTopic}.reply`;

    const response$ = new Subject<Hero[]>();

    const subscription = this.client.send(requestTopic, {}).subscribe({
      next: (data) => {
        console.log("Data", data);
        response$.next(data);
      },
      error: (error) => {
        console.log("Error", error);
        response$.error(error);
      },
      complete: () => {
        console.log("Request completed");
        response$.complete();
        subscription.unsubscribe();
      },
    });

    // Convert the observable to a promise and wait for completion
    const data = response$.pipe(toArray());
    return data; // Return the data
  }
}
