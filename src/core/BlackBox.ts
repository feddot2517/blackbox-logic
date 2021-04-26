import { randomString } from "../utils/randomString";
import {Scene} from "./Scene";

export class Block {
    _id: string;
    _scene: Scene;
    set: any;

    constructor() {
        this._id = randomString(20);
    }
}