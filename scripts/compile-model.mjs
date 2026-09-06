import ts from 'typescript';
import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
async function emit(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await emit(file);
    else if (/\.tsx?$/.test(file)) {
      const source = await readFile(file, 'utf8');
      const out = ts
        .transpileModule(source, {
          compilerOptions: {
            target: ts.ScriptTarget.ES2022,
            module: ts.ModuleKind.ESNext,
            jsx: ts.JsxEmit.ReactJSX,
          },
        })
        .outputText.replace(
          /(from\s+['"])(\.[^'"]+)(['"])/g,
          (_, a, b, c) => a + b + '.js' + c,
        );
      const dest = path.join('work/verify', file.replace(/\.tsx?$/, '.js'));
      await mkdir(path.dirname(dest), { recursive: true });
      await writeFile(dest, out);
    }
  }
}
await emit('src/domain');
await emit('src/data');
await emit('src/engine');
await emit('src/components/vocal-tract');
await emit('tests');
