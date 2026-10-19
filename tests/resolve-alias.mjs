import { register } from 'node:module';

register(
  'data:text/javascript,' +
    encodeURIComponent(`
    import { pathToFileURL } from 'node:url';
    import path from 'node:path';
    import fs from 'node:fs';

    export async function resolve(specifier, context, nextResolve) {
      if (specifier.startsWith('@/')) {
        const relativePath = specifier.replace(/^@\\//, './src/');
        let fullPath = path.resolve(process.cwd(), relativePath);

        if (!path.extname(fullPath)) {
          if (fs.existsSync(fullPath + '.js')) {
            fullPath = fullPath + '.js';
          } else if (fs.existsSync(fullPath + '.jsx')) {
            fullPath = fullPath + '.jsx';
          }
        }
        const targetUrl = pathToFileURL(fullPath).href;
        return nextResolve(targetUrl, context);
      }
      return nextResolve(specifier, context);
    }
  `)
);
