import { Scene } from "../core/Scene";
import { Block } from "../core/BlackBox";

const scene = new Scene();

@scene.observe
class Value extends Block {
    props: {
        value: number,
    };

    constructor(props: {value: number}) {
        super();
        this.props = props;
    }
}

@scene.observe
class Plus extends Block {
    props: {
        number1?: number,
        number2?: number,
        sum: number,
    };

    constructor(props: {number1?: number, number2?: number} = {number1: 0, number2: 0}) {
        super();
        // @ts-ignore
        this.props = props;

        if(!props.number1) {
            this.props.number1 = 0;
        }

        if(!props.number2) {
            this.props.number2 = 0;
        }
    }

    onUpdate() {
        const sum = +this.props.number1 + +this.props.number2;
        this.set('sum', sum);
    }

}

@scene.observe
class Logger extends Block {
    logBox: Array<any>;
    props: {
        value: any
    }

    constructor() {
        super();
        this.props = { value: 0 };
        this.logBox = Array<any>();
    }

    onUpdate(event: {_id: string, key: string, value: any, patch: any}) {
        this._scene.sendLog(event.value);
    }

    getLogBox() {
        return this.logBox;
    }
}



const valueBlock = new Value({value: 2});
const valueBlock2 = new Value({value: 3});
const plusBlock = new Plus();
const logger = new Logger();

scene.connect({block: valueBlock, field: 'value'}, {block: plusBlock, field: 'number1'})
scene.connect({block: valueBlock2, field: 'value'}, {block: plusBlock, field: 'number2'})
scene.connect({block: plusBlock, field: 'sum'}, {block: logger, field: 'value'})

valueBlock.set('value', 8);

console.log(scene.getLogs());

