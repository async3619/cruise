import { AbstractHttpAdapter } from '@nestjs/core'

export class DummyAdapter extends AbstractHttpAdapter {
  public constructor() {
    super({
      listen: () => {},
    })
  }

  public getHeader() {
    throw new Error('Method not implemented.')
  }

  public appendHeader() {
    throw new Error('Method not implemented.')
  }

  public applyVersionFilter(): (req: any, res: any, next: () => void) => any {
    throw new Error('Method not implemented.')
  }

  public close(): any {}

  public createMiddlewareFactory():
    | ((path: string, callback: any) => any)
    | Promise<(path: string, callback: any) => any> {
    return function () {
      return {}
    }
  }

  public enableCors() {
    return
  }

  public initHttpServer(): any {
    // we don't need to do anything
  }

  public getHttpServer(): any {
    return {
      once: () => {},
      address: () => {},
      listen: () => {},
    }
  }
  public getRequestHostname(): any {}
  public getRequestMethod(): any {}
  public getRequestUrl(): any {}
  public getType(): string {
    return 'electron'
  }

  public setErrorHandler(): any {}
  public setHeader(): any {}
  public setNotFoundHandler(): any {}
  public setViewEngine(): any {}

  public registerParserMiddleware(): any {}

  public isHeadersSent(): any {}

  public redirect(): any {}
  public render(): any {}
  public reply(): any {}
  public end(): any {}
  public status(): any {}
  public get(): any {}

  public useStaticAssets(): any {}
}
