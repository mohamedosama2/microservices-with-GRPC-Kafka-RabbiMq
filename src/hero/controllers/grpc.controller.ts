import { Controller, Get, Inject, OnModuleInit, Param } from "@nestjs/common";
import {
  ClientGrpc,
  GrpcMethod,
  GrpcStreamMethod,
} from "@nestjs/microservices";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { toArray } from "rxjs/operators";
import { HeroById } from "../interfaces/hero-by-id.interface";
import { Hero } from "../interfaces/hero.interface";
import { Post } from "@nestjs/common";
import { Body } from "@nestjs/common";
import { CreateHeroDto } from "../dto/Hero.dto";
import { HeroByName } from "../interfaces/create.hero.interface";

@Controller()
export class GrpcController {
  private readonly items: Hero[] = [
    { id: 1, name: "John" },
    { id: 2, name: "Doe" },
  ];

  @GrpcMethod("HeroService")
  findOne(data: HeroById): Hero {
    return this.items.find(({ id }) => id === data.id);
  }
  
  @GrpcStreamMethod("HeroService")
  findMany(data$: Observable<HeroById>): Observable<Hero> {
    const hero$ = new Subject<Hero>();
    const onNext = (heroById: HeroById) => {
      const item = this.items.find(({ id }) => id === heroById.id);
      hero$.next(item);
    };
    const onComplete = () => hero$.complete();
    data$.subscribe({
      next: onNext,
      complete: onComplete,
    });

    return hero$.asObservable();
  }

  @GrpcStreamMethod("HeroService")
  createHero(data$: Observable<HeroByName>): Observable<Hero> {
    // Open A connection
    const hero$ = new Subject<Hero>();
    const onNext = (heroByName: HeroByName) => {
      const lastId = this.items[this.items.length - 1].id;
      this.items.push({ id: lastId + 1, name: heroByName.name });
      // next on the connection
      hero$.next(this.items[this.items.length - 1]);
    };
    // close on the connection
    const onComplete = () => hero$.complete();
    data$.subscribe({
      next: onNext,
      complete: onComplete,
    });
    return hero$.asObservable();
  }
}
