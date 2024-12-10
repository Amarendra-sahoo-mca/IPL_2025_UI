export interface IResponseWithToken {
  success: boolean;
  message: string;
  data: any;
  role_access:any;
  user_details:any;
  statusCode: number;
  token: string;
  type?: string;
  rejected_reasion?:string;
}

export interface IResponse {
  success: boolean;
  message: string;
  data: any;
  statusCode: number;
  otp?: string;
}

export interface DropdownType{
    key:string;
    value:number;
}