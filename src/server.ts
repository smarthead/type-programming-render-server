import { createServer } from 'http';
import { getPathname, write } from './utils';

type PathParams<Path> =
  Path extends `${infer First}/${infer Rest}`
  ? { [K in (keyof PathParams<First> | keyof PathParams<Rest>)]: string }
  : Path extends `:${infer Param}`
    ? { [K in Param]: string }
    : {};

export class Server {
  route<T extends string>(
    path: T,
    render: (params: PathParams<T>) => Promise<string | null>
  ) {
    this.routes.push({ path, render });
  }

  listen(port: number) {
    this.server.listen(port);
  }

  close() {
    this.server.close();
  }

  private routes: {
    path: string,
    render: (params: any) => Promise<string | null>
  }[] = [];

  private server = createServer(async (request, response) => {
    const path = getPathname(request);
    const found = this.findRoute(path);

    if (found) {
      const { route, params } = found;
      try {
        const html = await route.render(params);
        
        if (html) {
          write(response, 200, html);
        } else {
          write(response, 404, 'Not Found');
        }
      } catch {
        write(response, 500, 'Server Error');
      }
    } else {
      write(response, 404, 'Not Found');
    }
  });

  private findRoute(path: string) {
    for (const route of this.routes) {
      const params = this.matchRoute(path, route.path);
      if (params) {
        return { route, params };
      }
    }
    return null;
  }

  private matchRoute(path: string, pattern: string) {
    const pathComponents = path.split('/');
    const patternComponents = pattern.split('/');

    if (pathComponents.length !== patternComponents.length) {
      return null;
    }

    const params: {
      [param: string]: string
    } = {};

    for (let i = 0; i < pathComponents.length; i++) {
      const pathComponent = pathComponents[i];
      const patternComponent = patternComponents[i];

      if (patternComponent.length > 0 && patternComponent[0] === ':') {
        const paramName = patternComponent.slice(1);
        params[paramName] = pathComponent;
      } else if (pathComponent !== patternComponent) {
        return null;
      }
    }

    return params;
  }
}
