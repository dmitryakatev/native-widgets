
import { Grid } from "./../grid";

export interface IRegisterPlugin<T> {
    type: string;
    plugin: IPluginConstructor<T>;
}

export interface IPluginConstructor<T> {
    new (props: IPluginProps, grid: Grid<T>): IPlugin;
}

export interface IPlugin { }

export interface IPluginProps {
    type: string;
    [propName: string]: any;
}
