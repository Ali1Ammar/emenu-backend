import { Kitchen } from "@prisma/client";
import { IsString } from "class-validator";

export class CreateKitchenDto {
    @IsString()

    name: string
}