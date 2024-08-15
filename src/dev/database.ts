import { getData, execTransaction, execTransactionBound } from './utilDb.js';
import { parseQueries, parseCsv, parseOfx } from './utilParse.js';
import type { Reference, Entry } from '../interfaces.js';

interface DataObj {
	queries: {
		schema: string[];
		seed: string[];
	};
	dynamicQueries: {
		insertRefs: string;
		insertEntries: string;
	};
	references: Reference[];
	entries: Entry[];
}

const buildDb = (data: DataObj) => {
	const { queries, dynamicQueries, references, entries } = data;

	execTransaction(queries.schema);
	console.log('Schema successful.');

	//pop users, sources, accounts
	execTransaction(queries.seed);
	console.log('Initial seed successful.');

	//pop refs
	execTransactionBound(dynamicQueries.insertRefs, references);
	console.log(`${references.length} references input successfully.`);

	//pop entries
	execTransactionBound(dynamicQueries.insertEntries, entries);
	console.log(`${entries.length} entries input successfully.`);
};

const main = async () => {
	try {
		const [schemaData, seedData, referenceData, entryData] = <string[]>(
			await Promise.all([
				getData('./src/models/schema.sql'),
				getData('./src/models/seed.sql'),
				getData('./testInputs/references.csv'),
				getData('./testInputs/entries.json'),
			])
		);

		const insertRefs = `
		INSERT INTO refs (
			ref_date,
			ref_date_offset,
			ref_memo,
			ref_amount,
			src_id
			)
		VALUES (@date, @dateOffset, @memo, @amount, @srcId);
		`;

		const insertEntries = `
		INSERT INTO entries (
			entry_type,
			entry_description
			)
		VALUES (@type, @description);
		`;

		const data: DataObj = {
			queries: {
				schema: parseQueries(schemaData),
				seed: parseQueries(seedData),
			},
			dynamicQueries: {
				insertRefs,
				insertEntries,
			},
			references: parseCsv(referenceData),
			entries: JSON.parse(entryData),
		};

		buildDb(data);
	} catch (err) {
		console.log(err);
	}
};

main();
