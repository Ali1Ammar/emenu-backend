import { HttpException, HttpStatus } from "@nestjs/common";


export class DefinedErrors {
static  UserNotFound = new HttpException("User Not Found" , HttpStatus.UNAUTHORIZED);
static  WrongPassword = new HttpException("Wrong Password" , HttpStatus.UNAUTHORIZED);
static  wrongInput(msg){ return new HttpException(msg , HttpStatus.BAD_REQUEST)};

}

