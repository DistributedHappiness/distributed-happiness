import { parse } from 'pgsql-ast-parser';
const ast = parse("INSERT INTO public.categories (id, name, is_active) VALUES ('123', 'test', true);");
console.log(JSON.stringify(ast, null, 2));
