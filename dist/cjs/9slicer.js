'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var png_es = require('png.es');

function slice(buffer, minReduction = 0) {
    const png = png_es.parse(buffer);
    const trimArea = getTrimArea(png);
    const repeatArea = getRepeatArea(png, trimArea);
    let needsSliceX = false;
    let needsSliceY = false;
    if (repeatArea.startX !== 0) {
        needsSliceX = true;
    }
    if (repeatArea.startY !== 0) {
        needsSliceY = true;
    }
    const newWidth = png.width - (repeatArea.endX - repeatArea.startX);
    const newHeight = png.height - (repeatArea.endY - repeatArea.startY);
    const reduction = Math.floor((1 - (newWidth * newHeight) / (png.width * png.height)) * 100);
    if (needsSliceX && needsSliceY) {
        if (reduction < minReduction) {
            needsSliceX = false;
            needsSliceY = false;
        }
    }
    if (!needsSliceX && !needsSliceY) {
        return {
            reduction: 0,
            buffer,
            params: {
                width: png.width,
                height: png.height,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            },
        };
    }
    const newPng = new png_es.PNG(newWidth, newHeight, png.colorType);
    for (let x = 1; x <= png.width; x++) {
        for (let y = 1; y <= png.height; y++) {
            if ((x <= repeatArea.startX || repeatArea.endX < x) && (y <= repeatArea.startY || repeatArea.endY < y)) {
                const newX = (x <= repeatArea.startX) ? x : x - (repeatArea.endX - repeatArea.startX);
                const newY = (y <= repeatArea.startY) ? y : y - (repeatArea.endY - repeatArea.startY);
                newPng.setPixel(newX, newY, png.getPixel(x, y));
            }
        }
    }
    return {
        reduction: reduction,
        buffer: png_es.pack(newPng),
        params: {
            width: png.width,
            height: png.height,
            left: (needsSliceX) ? repeatArea.startX - 1 : 0,
            right: (needsSliceX) ? png.width - repeatArea.endX : 0,
            top: (needsSliceY) ? repeatArea.startY - 1 : 0,
            bottom: (needsSliceY) ? png.height - repeatArea.endY : 0,
        },
    };
}
function getTrimArea(png) {
    const data = png.data;
    const baseWidht = png.width;
    const baseHgith = png.height;
    const pixelLength = png.pixelLength;
    const area = {
        startX: baseWidht,
        endX: 0,
        startY: baseHgith,
        endY: 0,
    };
    let alphaIndex = 0;
    if (png.colorType === png_es.COLOR_TYPE.RGBA) {
        alphaIndex = 3;
    }
    else if (png.colorType === png_es.COLOR_TYPE.GRAY_ALPHA) {
        alphaIndex = 1;
    }
    if (alphaIndex === 0) {
        area.startX = 1;
        area.endX = baseWidht;
        area.startY = 1;
        area.endY = baseHgith;
        return area;
    }
    for (let x = 0; x < baseWidht; x++) {
        for (let y = 0; y < baseHgith; y++) {
            const idx = (x + y * baseWidht) * pixelLength;
            if (0 !== data[idx + alphaIndex]) {
                if (x < area.startX) {
                    area.startX = x;
                }
                if (y < area.startY) {
                    area.startY = y;
                }
                if (area.endX < x) {
                    area.endX = x;
                }
                if (area.endY < y) {
                    area.endY = y;
                }
            }
        }
    }
    area.startX++;
    area.endX++;
    area.startY++;
    area.endY++;
    return area;
}
function getRepeatArea(png, targetArea) {
    const pixelLength = png.pixelLength;
    const area = {
        startX: 0,
        endX: 0,
        startY: 0,
        endY: 0,
    };
    let isRepeat = false;
    let repeatCountMax = 0;
    let repeatCount = 0;
    for (let x = targetArea.startX; x < targetArea.endX; x++) {
        isRepeat = true;
        LOOP_Y: for (let y = targetArea.startY; y <= targetArea.endY; y++) {
            const nowPixel = png.getPixel(x, y);
            const nextPixel = png.getPixel(x + 1, y);
            for (let i = 0; i < pixelLength; i++) {
                if (nowPixel[i] !== nextPixel[i]) {
                    isRepeat = false;
                    break LOOP_Y;
                }
            }
        }
        if (isRepeat) {
            repeatCount++;
            if (2 <= repeatCount && repeatCountMax < repeatCount) {
                area.startX = x - repeatCount + 1;
                area.endX = x + 1;
                repeatCountMax = repeatCount;
            }
        }
        else {
            repeatCount = 0;
        }
    }
    repeatCountMax = 0;
    repeatCount = 0;
    for (let y = targetArea.startY; y < targetArea.endY; y++) {
        isRepeat = true;
        LOOP_X: for (let x = targetArea.startX; x <= targetArea.endX; x++) {
            const nowPixel = png.getPixel(x, y);
            const nextPixel = png.getPixel(x, y + 1);
            for (let i = 0; i < pixelLength; i++) {
                if (nowPixel[i] !== nextPixel[i]) {
                    isRepeat = false;
                    break LOOP_X;
                }
            }
        }
        if (isRepeat) {
            repeatCount++;
            if (2 <= repeatCount && repeatCountMax < repeatCount) {
                area.startY = y - repeatCount + 1;
                area.endY = y + 1;
                repeatCountMax = repeatCount;
            }
        }
        else {
            repeatCount = 0;
        }
    }
    return area;
}

exports.slice = slice;
