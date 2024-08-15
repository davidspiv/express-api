import { getData, execTransaction, execTransactionBound } from './utilDb.js';
import { parseQueries, parseCsv, parseOfx } from './utilParse.js';
import type { Reference } from '../interfaces.js';

interface QueryObj {
	schema: string[];
	seed: string[];
	references: Reference[];
}

const buildDb = (queries: QueryObj) => {
	const { schema, seed, references } = queries;

	execTransaction(schema);
	console.log('Schema successful.');

	//pop users, sources, accounts
	execTransaction(seed);
	console.log('Initial seed successful.');

	//pop refs
	const queryInsertRefs = `
	INSERT INTO refs (
		ref_date,
		ref_date_offset,
		ref_memo,
		ref_amount,
		src_id
		)
	VALUES (@date, @dateOffset, @memo, @amount, @srcId);
	`;
	execTransactionBound(queryInsertRefs, references);
	console.log(`${references.length} references input successfully.`);
};

const main = async () => {
	try {
		const [schemaData, seedData, referenceData] = <string[]>(
			await Promise.all([
				getData('./src/models/schema.sql'),
				getData('./src/models/seed.sql'),
				getData('./testInputs/references.csv'),
			])
		);

		const queries = {
			schema: parseQueries(schemaData),
			seed: parseQueries(seedData),
			references: parseCsv(referenceData),
		};

		buildDb(queries);
	} catch (err) {
		console.log(err);
	}
};

main();
