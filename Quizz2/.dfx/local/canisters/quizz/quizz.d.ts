import type { Principal } from '@dfinity/agent';
export type PrincipalTextual = string;
export type Result = { 'ok' : null } |
  { 'err' : null };
export interface Student { 'id' : number, 'name' : string, 'note' : number };
export interface quizz {
  'PotentialWinners' : () => Promise<Array<string>>,
  'alreadyGotToken' : (arg_0: PrincipalTextual) => Promise<boolean>,
  'distribute' : (arg_0: PrincipalTextual) => Promise<Result>,
  'quizzFinished' : (arg_0: string, arg_1: result) => Promise<number>,
  'showAStudent' : (arg_0: number) => Promise<[] | [Student]>,
  'statisticsStudents' : () => Promise<Array<number>>,
};
export type result = Array<bigint>;
export default quizz;