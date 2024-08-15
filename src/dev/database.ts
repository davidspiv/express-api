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
		const references = parseCsv(referenceData);
		const entries = JSON.parse(entryData);

		const insertRefs = `
		INSERT INTO refs (
			ref_id,
			ref_date,
			ref_date_offset,
			ref_memo,
			ref_amount,
			src_id
			)
		VALUES (@id, @date, @dateOffset, @memo, @amount, @srcId);
		`;

		const insertEntries = `
		INSERT INTO entries (
			entry_id,
			entry_type,
			entry_description
			)
		VALUES (@id, @type, @description);
		`;

		execTransaction(createSchema);
		execTransaction(seedDatabase);

		execTransactionBound(insertRefs, references);
		execTransactionBound(insertEntries, entries);
	} catch (err) {
		console.log(err);
	}
};

main();
