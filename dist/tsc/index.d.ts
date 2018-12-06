/**
 * @license Copyright (c) 2018 zprodev
 * https://github.com/zprodev/9-slicer
 */
interface ISliceResult {
    reduction: number;
    buffer: Uint8Array;
    params: {
        width: number;
        height: number;
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
}
export declare function slice(buffer: Uint8Array, minReduction?: number): ISliceResult;
export {};
