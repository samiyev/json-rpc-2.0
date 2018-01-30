import {IMethod} from "./composer";

export interface IDefine {
    [key: string]: IMethod;
}

export abstract class Define {
    public modulename: string;
}