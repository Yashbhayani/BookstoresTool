export interface IProductSaveModel {
    pid: string;
    code?: string;
    name: string;
    isActive: boolean;
}

export interface ICategorySaveModel{
    sID: string;
    pID: number;
    code?: string;
    path?: string;
    name: string;
    isActive: boolean;
}


export interface ISubCategorySaveModel{
    scID: string;
    pID: number;
    cID: number;
    code?: string;
    path?: string;
    name: string;
    isActive: boolean;
}