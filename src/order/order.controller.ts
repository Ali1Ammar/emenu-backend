import { Controller } from '@nestjs/common';

@Controller('order')
export class OrderController {}


//TODO when user order we should create jwt for this order in dont edit the order except if this jwt vaide