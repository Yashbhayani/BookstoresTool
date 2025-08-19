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

export interface ISelectCategoryModel{
    isActive: number;
    name: string;
    pID: number;
    sID: number;
}

export interface ICustomerModel {
    id: string;
    email : string;
    firstName: string;
    lastName: string;
    image: string;
    isActive: boolean;
    isDeleted: boolean;
}

export interface ApplyUserAdminListModel {
  gidtype: string;
  userId: string;
  email: string;
  firstName: string;
  idProof: string | null;
  image: string;
  isActive: boolean;
  isDeleted: boolean;
  lastName: string;
}


export interface IuserInfoModel {
    created_date: Date;
    isactive: boolean;
    isuser_valid: number;
    uiid: string;
}   

// IpLookupResult.ts

export interface IpLookupResult {
  // User credentials
  email: string;
  password: string;
  ip4address: string;
  ip6address: string;

  // IP lookup fields
  status?: string;
  country?: string;
  countryCode?: string;
  region?: string;
  regionName?: string;
  city?: string;
  zip?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  isp?: string;
  org?: string;
  asn?: string;
  query?: string; // original IP
}
