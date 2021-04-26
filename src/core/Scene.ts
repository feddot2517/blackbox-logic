import { EventEmitter } from "events";
import _ =  require('lodash');
import {Block} from "./BlackBox";

export class Scene extends EventEmitter {
    _connections: Array<any>;
    logs: Array<any>;

    constructor() {
        super();
        this._connections = [];
        this.logs = Array<any>();
    }

    observe = (constructor: any):any => {
        const thisClass = this;

        return class extends constructor {
            _scene: Scene = thisClass;
            set(key: string, value: any) {
                thisClass.emit('change', {_id: this._id, key, value});
                // @ts-ignore
                this.props[key] = value;
            }
        };
    }

    sendLog(log: any) {
        this.logs.push(log);
    }

    getLogs() {
        return this.logs;
    }

    clearLogs() {
        this.logs = [];
    }

    hasConnection(id1: string, id2: string, sField: string, tField: string): boolean {
        const hasST = !!this._connections.find(i => _.isEqual(i, {s: id1, t: id2, sField, tField}));
        const hasTS = !!this._connections.find(i => _.isEqual(i, {s: id2, t: id1, sField, tField}));
        const hasSS = !!this._connections.find(i => _.isEqual(i, {s: id1, t: id1, sField, tField}));
        const hasTT = !!this._connections.find(i => _.isEqual(i, {s: id2, t: id2, sField, tField}));

        return hasSS || hasST || hasTT || hasTS;
    }

    connect(source: ISourceConnect, target: ITargetConnect) {
        if(this.hasConnection(source.block._id, target.block._id, source.field, target.field)) return;
        this.on('change', (e: IWorldEvent) => {
            if (e._id === source.block._id) {
                if(e.key === source.field) {
                    target.block.set(target.field, e.value);
                    target.block.onUpdate({key: e.key, value: e.value, patch: target.block, _id: target.block._id});
                }
            }
        })
        source.block.set(source.field, source.block.props[source.field]);
        this._connections.push({s: source.block._id, sField: source.field, t: target.block._id, tField: target.field})
    }
}

interface ITargetConnect {
    block: any,
    field: string
}

interface ISourceConnect {
    block: any,
    field: string
}

export interface IWorldEvent {
    _id: string,
    key: string,
    value: any;
}