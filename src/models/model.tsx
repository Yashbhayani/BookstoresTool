export interface IProductModel {
    id: string;
    name: string;
    isActive: boolean;
    isDeleted:boolean;
}


// Assuming this is in a file like ProductModel.js or within your React component file

export interface ICategoryModel {
    id: string;
    productName: string;
    categoryValue: string;
    categoryPath: string;
    isActive: boolean;
    isDeleted:boolean;
}


export interface ISubcategoryModel {
    id: string;
    productName: string;
    categoryName: string;
    subCategoryValue: string;
    subCategoryPath: string;
    isactive: boolean;
    isdelete:boolean;
}


export interface ISelectModel{
    id: number;
    name: string;
}
