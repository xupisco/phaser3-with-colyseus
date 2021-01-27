interface StateConfig {
    onEnter?: () => void;
    onUpdate?: (dt: number) => void;
    onExit?: () => void;
}

export default class StateMachine {
    private context?: any;
    private states = new Map<string, StateConfig>();
    
    private currentState?: StateConfig;
    
    constructor(context?: any) {
        this.context = context;
    }
    
    addState(name: string, config: StateConfig) {
        this.states.set(name, {
           onEnter: config.onEnter?.bind(this.context),
           onUpdate: config.onUpdate?.bind(this.context),
           onExit: config.onExit?.bind(this.context)
        });
    }
    
    setState(name: string) {
        if (this.states.has(name)) {
            return;
        }
        
        if (this.currentState && this.currentState.onExit) {
            this.currentState.onExit();
        }

        this.currentState = this.states.get(name);

        if (this.currentState.onEnter) {
            this.currentState.onEnter();
        }
    }
    
    update(dt: number) {
        if (!this.currentState) {
            return;
        }
        
        if (this.currentState.onUpdate) {
            this.currentState.onUpdate(dt);
        }
    }
}
