import {
  /* inject, */
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({tags: {key: AddCountToResultInterceptor.BINDING_KEY}})
export class AddCountToResultInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${AddCountToResultInterceptor.name}`;

  /*
  constructor() {}
  */

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(invocationCtx: InvocationContext, next: () => ValueOrPromise<InvocationResult>) {
    try {
      // Add pre-invocation logic here
      const result = await next();
      // Add post-invocation logic here
      // console.log(invocationCtx.args);
      // const newResult = {
      //   count: result.length,
      //   data: result,
      // };
      // console.log(`result= ${result}`);
      // return newResult;
      return result;
    } catch (err) {
      // Add error handling logic here
      // eslint-disable-next-line no-console
      console.log(err);
      throw err;
    }
  }
}
