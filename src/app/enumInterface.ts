export enum LevelEnum {
  LEVEL2 = 'CERTIFICATION_LEVEL_2_FORM',
  LEVEL3 = 'CERTIFICATION_LEVEL_3_FORM',
  LEVELFT = 'CERTIFICATION_LEVEL_2_FT'
}

export enum CohortLevelEnum {
  LEVEL2 = 'level_2',
  LEVEL3 = 'level_3',
  LEVELFT = 'level_2_ft'
}

export interface CountryInterface {
  name: string;
  code: string;
}

export interface CohortInterface {
  title: string;
  pk: number;
  currency: string;
  date: Date;
  price: number;
}
