import { ILogger } from "./types";

export const Template = {
  Undefined: undefined,
  Null: null,
  Boolean: false,
  BooleanOptional: true,
  Number: 0,
  NumberOptional: 1,
  String: "string",
  StringOptional: "undefined",
  BigInt: BigInt(0),
  BigIntOptional: BigInt(1),
  Symbol: Symbol("symbol"),
  SymbolOptional: Symbol("undefined"),
  //TODO
  Function: () => {},
  FunctionOptional: () => {},
  Object: {},
  ObjectOptional: {},
};

type Flatten<T> = { [K in keyof T]: T[K] } & {};

// #region Standard Types
export function IsUndefined(value: unknown): value is undefined {
  return value === undefined;
}

export function IsNull(value: unknown): value is null {
  return value === null;
}

export function IsBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function IsNumber(value: unknown): value is number {
  return typeof value === "number";
}

export function IsBigInt(value: unknown): value is bigint {
  return typeof value === "bigint";
}

export function IsString(value: unknown): value is string {
  return typeof value === "string";
}

export function IsSymbol(value: unknown): value is symbol {
  return typeof value === "symbol";
}

export function IsFunction(
  value: unknown
): value is (...args: unknown[]) => unknown {
  return typeof value === "function";
}

export function IsObject(value: unknown): value is object {
  return value !== null && typeof value === "object";
}
// #endregion

// #region Extended Types
export function ObjectIsArray<T extends object>(
  value: T
): value is T & unknown[] {
  if (!IsObject(value)) return false;
  return Array.isArray(value);
}
// #endregion

// #region Utility Functions
export function ObjectContainsKey<T extends object, K extends string>(
  value: T,
  key: K
): value is Flatten<T & { [P in K]: unknown }> {
  return key in value;
}

export function ObjectMatchesTemplate<T extends object>(
  value: unknown,
  template: T,
  logger?: ILogger
): value is T {
  if (!IsObject(value)) {
    logger?.warn("Value is not an object", value);
    return false;
  }

  for (const key in template) {
    if (typeof template[key] === "undefined") {
      logger?.info(`Property '${key}' is optional`);
      continue;
    }

    if (!ObjectContainsKey(value, key)) {
      logger?.warn(`Property '${key}' is not optional, but missing in ${value}`);
      return false;
    }

    if (typeof value[key] !== typeof template[key]) {
      logger?.warn(
        `Property '${key}' of type ${typeof value[
          key
        ]} does not match template of type ${typeof template[key]} in `,
        value
      );
      return false;
    }

    if (IsObject(template[key])) {
      if (!ObjectMatchesTemplate(value[key], template[key])) return false;
    }
  }
  return true;
}

// #endregion

//Test
/*
export function ObjectContainsKeys<T extends object, K extends string[]>(
  value: T,
  keys: K
): value is T & Record<K[number], unknown> {
  return keys.every((key) => ObjectContainsKey(value, key));
}

export function ObjectKeyIsObject<T extends object, K extends string>(
  value: T,
  key: K
): value is T & Record<K, object> {
  if (!ObjectContainsKey(value, key)) return false;
  return IsObject(value[key]);
}

export function ObjectKeyIsString<T extends object, K extends string>(
  value: T,
  key: K
): value is Flatten<T & { [P in K]: string }> {
  if (!ObjectContainsKey(value, key)) return false;
  return IsString(value[key]);
}

export function ObjectKeyIsStringOptional<T extends object, K extends string>(
  value: T,
  key: K
): value is Flatten<T & { [P in K]: string | undefined }> {
  if (!ObjectContainsKey(value, key)) return true;
  if (value[key] === undefined) return true;
  return IsString(value[key]);
}

export function ObjectKeyIsNumber<T extends object, K extends string>(
  value: T,
  key: K
): value is T & Record<K, string> {
  if (!ObjectContainsKey(value, key)) return false;
  return IsNumber(value[key]);
}

/*

type func = (...args: unknown[]) => unknown;
type TBasicTypes =
  | undefined
  | null
  | boolean
  | number
  | bigint
  | string
  | symbol
  | func
  | object;

const BasicTypeString = [
  "undefined",
  "null",
  "boolean",
  "number",
  "bigint",
  "string",
  "symbol",
  "function",
  "object"
] as const;

type TBasicTypeString =
  | "undefined"
  | "null"
  | "boolean"
  | "number"
  | "bigint"
  | "string"
  | "symbol"
  | "function"
  | "object";

type TypeMap = {
  undefined: "undefined"
  null: null
  boolean: boolean;
  number: number;
  bigint: bigint;
  string: string;
  symbol: symbol;
  function: func;
  object: object;
};

function getTypeString<T>(value: T): string {
  return typeof value as typeof  BasicTypeString[number] || "undefined";
}

function GetTypeString(value: unknown): TBasicTypeString {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  if (typeof value === "bigint") return "bigint";
  if (typeof value === "string") return "string";
  if (typeof value === "symbol") return "symbol";
  if (typeof value === "function") return "function";
  return "object";

}

export function ObjectKeyIs<T extends TBasicTypes, P extends object, K extends string>(
  value: P,
  key: K
): value is P & Record<K, T> {
  if (!ObjectContainsKey(value, key)) return false;
  const valueType  = GetTypeString(value[key]);
  const keyType  = getTypeString(value);
  return valueType === keyType;
}




*/
