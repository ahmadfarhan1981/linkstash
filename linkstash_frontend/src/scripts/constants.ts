export const EMPTY_FUNCTION = () => {};
export const EMPTY_BODY = JSON.stringify({});
export const EMPTY_PARAM = {} as Record<string, any>;

export const DEFAULT_FAILURE_CALLBACK = (error: any) => {
  console.log(error);
};
export const DEFAULT_FINALLY_CALLBACK = EMPTY_FUNCTION;

export const DEFAULT_HEADERS =  {
  "Content-Type": "application/json",
  "User-Agent": "Linkstash react frontend",
}

export const DEFAULT_TIMEOUT_IN_MILISECONDS = 3000