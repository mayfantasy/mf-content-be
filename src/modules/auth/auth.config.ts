import { IKeyValue } from 'src/types/utils';
import { ITier } from './auth.types';

export const tiers = {
  admin: {
    name: 'Admin',
    tier: 2,
    key: 'admin',
  } as ITier,
  writer: {
    name: 'Writer',
    tier: 3,
    key: 'writer',
  } as ITier,
  basic: {
    name: 'Basic',
    tier: 100,
    key: 'basic',
  } as ITier,
};

export const allTiers = {
  ...tiers,
  root: {
    name: 'Root',
    tier: 1,
    key: 'root',
  } as ITier,
};

export const findTierNameByLevel = (tier: number) => {
  const foundTierKey = Object.keys(tiers).find(
    (t) => (tiers as IKeyValue)[t].tier === tier,
  );
  return foundTierKey ? (tiers as IKeyValue)[foundTierKey].name : null;
};

export const tierMap = {
  // Auth
  LOGIN: allTiers.basic,
  LOGIN_WITH_TOKEN: allTiers.basic,
  // Access Key
  CREATE_ACCESS_KEY: allTiers.root,
  GET_ACCESS_KEY_LIST: allTiers.admin,
  DELETE_ACCESS_KEY: allTiers.admin,
  // Create Account
  CREATE_ACCOUNT: allTiers.basic,
  // Collection
  CREATE_COLLECTION: allTiers.admin,
  GET_COLLECTION_LIST: allTiers.writer,
  GET_COLLECTION_BY_ID: allTiers.admin,
  UPDATE_COLLECTION_BY_ID: allTiers.admin,
  DELETE_COLLECTION_BY_ID: allTiers.admin,
  // Schema
  CREATE_SCHEMA: allTiers.admin,
  GET_SCHEMA_LIST: allTiers.writer,
  UPDATE_SCHEMA: allTiers.admin,
  GET_SCHEMA_BY_ID: allTiers.writer,
  DELETE_SCHEMA_BY_ID: allTiers.admin,
  GET_SCHEMA_BY_HANDLE: allTiers.writer,
  // Storage
  UPLOAD_IMAGE: allTiers.writer,
  GET_IMAGE_LIST: allTiers.writer,
  DELETE_IMAGE: allTiers.admin,
  // Object
  CREATE_OBJECT: allTiers.writer,
  PARSE_OBJECTS: allTiers.writer,
  GET_OBJECT_LIST: allTiers.writer,
  UPDATE_OBJECT_BY_ID: allTiers.writer,
  GET_OBJECT_BY_ID: allTiers.writer,
  DELETE_OBJECT_BY_ID: allTiers.writer,
  UPDATE_OR_CREATE_OBJECT_BY_HANDLE: allTiers.writer,
  // User
  CREATE_USER: allTiers.admin,
  GET_USER_LIST: allTiers.writer,
  GET_USER_BY_ID: allTiers.writer,
  UPDATE_USER: allTiers.admin,
  DELETE_USER: allTiers.admin,
  // User Meta
  UPDATE_USER_META: allTiers.admin,
  DELETE_USER_META_ITEM: allTiers.admin,
  // User Auth
  USER_LOGIN: allTiers.admin,
  USER_LOGIN_WITH_TOKEN: allTiers.admin,
  USER_RESET_PASSWORD_BY_CURRENT_PASSWORD: allTiers.admin,
  USER_RESET_EMAIL: allTiers.admin,
  USER_SEND_RECOVER_EMAIL: allTiers.admin,
  USER_RESET_PASSWORD: allTiers.admin,
  // Member
  CREATE_MEMBER: allTiers.root,
  GET_MEMBER_LIST: allTiers.root,
  GET_MEMBER_BY_ID: allTiers.root,
  UPDATE_MEMBER_BY_ID: allTiers.root,
  DELETE_MEMBER: allTiers.root,
  // Shortcut
  CREATE_SHORTCUT: allTiers.admin,
  GET_SHORTCUT_LIST: allTiers.writer,
  DELETE_SHORTCUT: allTiers.admin,
  // Email
  SEND_EMAIL: allTiers.admin,
};
