import type { FieldPath as FieldPathImpl } from "react-hook-form";

function compact<T>(value: T[]): T[] {
    return Array.isArray(value) ? value.filter(Boolean) : [];
}
function isUndefined(value: any): value is undefined {
    return typeof value === "undefined";
}
function isNullOrUndefined(value: any): value is null | undefined {
    return value === null || isUndefined(value);
}
function isObjectType(value: any): value is object {
    return typeof value === "object";
}
function isDateObject(value: any): value is Date {
    return value instanceof Date;
}
export function isObject<T extends object>(value: any): value is T {
    return !isNullOrUndefined(value) && !Array.isArray(value) && isObjectType(value) && !isDateObject(value);
}

export type BaseObject = Record<string, any>;
export type FieldPath<T extends BaseObject> = FieldPathImpl<T>;
export type FieldPathValue<
    T extends BaseObject,
    Path extends string, // Or, if you prefer, NestedPaths<T>
> = {
    [K in Path]: K extends keyof T
        ? T[K]
        : K extends `${infer P}.${infer S}`
        ? T[P] extends BaseObject
            ? FieldPathValue<T[P], S>
            : never
        : never;
}[Path];

export function getFromPath<T extends BaseObject, Path extends FieldPath<T>>(
    obj: T,
    path: Path,
    defaultValue?: any,
): FieldPathValue<T, Path> | undefined {
    if (!path || !isObject(obj)) {
        return defaultValue;
    }

    const result = compact(path.split(/[,[\].]+?/)).reduce(
        (result, key) => (isNullOrUndefined(result) ? result : result[key as keyof T]),
        obj,
    );

    return isUndefined(result) || result === obj
        ? isUndefined(obj[path as keyof T])
            ? defaultValue
            : obj[path as keyof T]
        : result;
}
