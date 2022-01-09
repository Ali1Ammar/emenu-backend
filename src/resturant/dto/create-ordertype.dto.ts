import { DeliverType, OrderType, PaymentType } from "@prisma/client";

export class CreateOrderTypeDto {
    name: string
    paymentMsg: string
    deliverMsg: string
    paymentType: PaymentType
    deliverType: DeliverType
}