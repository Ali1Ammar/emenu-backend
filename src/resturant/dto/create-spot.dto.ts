import { OrderType, Prisma } from '@prisma/client';


export class CreateSpotDto   {
		
	note?: string;
	
	resturantId: number 
			
	kitchenId?: number
	
	orderTypeIds?: number[]
}