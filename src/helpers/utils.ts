import { IResult } from '../types/utils';

export function result<T>(obj: T): IResult<T> {
  return {
    result: obj,
  };
}
