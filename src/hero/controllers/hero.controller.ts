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

interface HeroService {
  findOne(data: HeroById): Observable<Hero>;
  findMany(upstream: Observable<HeroById>): Observable<Hero>;
  createHero(data: Observable<HeroByName>): Observable<Hero>;
}

@Controller("hero")
export class HeroController implements OnModuleInit {
  private readonly items: Hero[] = [
    { id: 1, name: "John" },
    { id: 2, name: "Doe" },
  ];

  private heroService: HeroService;

  constructor(@Inject("HERO_PACKAGE") private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.heroService = this.client.getService<HeroService>("HeroService");
    console.log(this.heroService);
  }

  @Get()
  getMany(): Observable<Hero[]> {
    const ids$ = new ReplaySubject<HeroById>();
    ids$.next({ id: 1 });
    ids$.next({ id: 2 });
    ids$.complete();
    const stream = this.heroService.findMany(ids$.asObservable());
    return stream.pipe(toArray());
  }
  @Get(":id")
  getById(@Param("id") id: string): Observable<Hero> {
    return this.heroService.findOne({ id: +id });
  }
  @Post()
  addHero(@Body() CreateHeroDto: CreateHeroDto[]) {
    const heros$ = new ReplaySubject<HeroByName>();
    for (let i = 0; i < CreateHeroDto.length; i++) {
      const hero = CreateHeroDto[i];

      heros$.next({ name: hero.name });
    }
    heros$.complete();
    const stream = this.heroService.createHero(heros$.asObservable());
    return stream.pipe(toArray());
  }
}
