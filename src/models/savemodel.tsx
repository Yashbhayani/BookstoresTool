export interface IProductSaveModel {
    pid: string;
    code?: string;
    name: string;
    isActive: boolean;
}

export interface ICategorySaveModel{
    sID: string;
    pID: number;
    code: string;
    path: string;
    name: string;
}