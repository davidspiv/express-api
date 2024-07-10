import { readFile } from "node:fs/promises";
import Database from "better-sqlite3";
const getData = async (fileName) => {
    try {
        const contents = await readFile(fileName, {
            encoding: "utf8",
        });
        return contents;
    }
    catch (err) {
        console.log("Unable to retrieve text from file.");
    }
    return "";
};
async function getQueries(filePath) {
    const data = await getData(filePath);
    if (!data)
        return [];
    const queryArr = data.split(/(?<=;)/g);
    queryArr.pop();
    return queryArr;
}
function execDbTransaction(queries) {
    const db = new Database("accounting.db");
    const enterQueries = db.transaction(() => {
        for (const query of queries) {
            db.prepare(query).run();
        }
    });
    enterQueries();
    db.close();
}
export { getData, getQueries, execDbTransaction };
