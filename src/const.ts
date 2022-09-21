export enum MESSAGE_LEVEL_TYPES {
  debug = 0,
  info = 1,
  warning = 2,
  error = 3,
  nothing = 4,
}

export enum CONFIG_NAMES {
  local = 'local',
  development = 'development',
  production = 'production',
}

export const noop = (_?: any, __?: any) => _ || __;
