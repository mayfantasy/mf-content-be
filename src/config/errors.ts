export enum EErrorCodes {
  // 0001 Auth
  'AUTH_00011' = '[Code: 00011] Token can not be generated.',
  'AUTH_00012' = '[Code: 00012] Token can not be verified.',
  'AUTH_00013' = '[Code: 00013] You do not have permission.',
  'AUTH_00014' = '[Code: 00014] Unauthorized.',

  // 0002 Internal
  'INTERNAL_00021' = '[Code: 00021] Can not find account.',

  // 0003 Account
  'ACCOUNT_00031' = '[Code: 00031] Can not create account.',
  'ACCOUNT_00032' = '[Code: 00032] Account already exists.',

  // 0004 Access Key
  'ACCESS_KEY_00041' = '[Code: 00041] Can not create access key.',
}
