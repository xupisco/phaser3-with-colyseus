import BaseState from "./BaseState";

interface IState {
    name?: string;
    onEnter?: () => void;
    onUpdate?: (dt: number) => void;
    onExit?: () => void;
}

export default class StateMachine {
    private context?: object;
    private name: string;
    private states = new Map<string, IState>();
    
    private currentState?: IState;
    private isSwitchingState = false;
    private stateQueue: string[] = [];
    
    constructor(context?: any, name?: string) {
        this.context = context;
        this.name = name ?? 'fsm';
    }
    
    addState(name: string, config?: BaseState | {
        onEnter?: () => void,
        onUpdate?: (dt: number) => void,
        onExit?: () => void
    }) {
        this.states.set(name, {
            name,
            onEnter: config?.onEnter?.bind(this.context),
            onUpdate: config?.onUpdate?.bind(this.context),
            onExit: config?.onExit?.bind(this.context)
        });
        
        return this;
    }
    
    isCurrentState(name: string) {
        if (!this.currentState) {
            return false;
        }
        
        return this.currentState.name == name;
    }
    
    setState(name: string) {
        if (!this.states.has(name)) {
            return;
        }
        
        if (this.isSwitchingState) {
            this.stateQueue.push(name);
            return ;
        }
        
        this.isSwitchingState = true;
        console.log(`[StageMachine (${this.name})] change from ${this.currentState?.name ?? 'none'} to ${name}`);
        
        if (this.currentState && this.currentState.onExit) {
            this.currentState.onExit();
        }

        this.currentState = this.states.get(name);

        if (this.currentState.onEnter) {
            this.currentState.onEnter();
        }
        this.isSwitchingState = false;
        
        return this;
    }
    
    update(dt: number) {
        if (this.stateQueue.length > 0) {
            const name = this.stateQueue.shift();
            this.setState(name);
            return;
        }
        
        if (!this.currentState) {
            return;
        }
        
        if (this.currentState.onUpdate) {
            this.currentState.onUpdate(dt);
        }
    }
}
