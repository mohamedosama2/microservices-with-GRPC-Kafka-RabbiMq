import { IsString } from "class-validator";

export class CreateHeroDto {
  @IsString()
  name: string;
}
