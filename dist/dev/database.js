import { getData, parseCsv } from "./utils.js";
import Database from "better-sqlite3";
import { addManyTrans } from "../db/addManyTrans.js";
const queryArr = await getQueries("./dist/dev/up_migration.sql");
const transArr = await parseCsv();
buildSchema(queryArr);
addManyTrans(transArr);
console.log(`
${queryArr.length} initial query(ies) ran successfully.
${transArr.length} transactions input successfully.
`);
async function getQueries(filePath) {
    const data = await getData(filePath);
    if (!data)
        return [];
    const queryArr = data.split(/(?<=;)/g);
    queryArr.pop();
    return queryArr;
}
function buildSchema(queries) {
    const db = new Database("accounting.db");
    const enterQueries = db.transaction(() => {
        for (const query of queries) {
            db.prepare(query).run();
        }
    });
    enterQueries();
    db.close();
}
