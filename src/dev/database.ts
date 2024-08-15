import { getData, execTransaction, execTransactionBound } from './utilDb.js';
import { parseQueries, parseCsv, parseOfx } from './utilParse.js';

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

		const createSchema = parseQueries(schemaData);
		const seedDatabase = parseQueries(seedData);

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

		execTransaction(createSchema);
		execTransaction(seedDatabase);

		execTransactionBound(insertRefs, parseCsv(referenceData));
		execTransactionBound(insertEntries, JSON.parse(entryData));
	} catch (err) {
		console.log(err);
	}
};

main();
