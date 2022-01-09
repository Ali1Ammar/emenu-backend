export class CreateMainCategoryDto {
    title: string;
    desc: string;
    img: string;
}

export class CreateSubCategoryDto {
    title: string;
    img: string;
    mainCategoryId:number
}