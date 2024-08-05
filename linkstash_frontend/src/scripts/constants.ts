export const DEV_MOCK_RESPONSE = false
export const EMPTY_FUNCTION = () => {};
export const EMPTY_BODY = JSON.stringify({});
export const EMPTY_PARAM = {} as Record<string, any>;

export const DEFAULT_FAILURE_CALLBACK = (error: any) => {
  // eslint-disable-next-line no-console
  console.log(error);
  //TODO logging
};
export const DEFAULT_FINALLY_CALLBACK = EMPTY_FUNCTION;

export const DEFAULT_HEADERS =  {
  "Content-Type": "application/json",
  "User-Agent": "Linkstash react frontend",
}

export const DEFAULT_TIMEOUT_IN_MILISECONDS = 3000

