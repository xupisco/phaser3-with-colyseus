export default abstract class BaseState {
    abstract onEnter?: () => void;
    abstract onUpdate?: (dt: number) => void;
    abstract onExit?: () => void;
}
