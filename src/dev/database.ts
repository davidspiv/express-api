import { getDataPromises } from './utilDb.js';
import { buildSchema, insertModels } from './utilDb.js';
import { parseQueries, parseCsv } from './utilParse.js';

const main = async () => {
	const fileNames = [
		'./src/models/schema.sql',
		'./testInputs/transactions.csv',
		'./testInputs/accounts.json',
		'./testInputs/entries.json',
		'./testInputs/sources.json',
		'./testInputs/users.json',
	];

	const data: string[] = [];
	const promises = getDataPromises(fileNames);

	try {
		data.push(...(await Promise.all(promises)));
	} catch (err) {
		console.log(err);
	}

	const [
		dataSchema,
		dataReferences,
		dataAccounts,
		dataEntries,
		dataSources,
		dataUsers,
	] = data;

	const schema = parseQueries(dataSchema);
	const references = parseCsv(dataReferences);
	const accounts = JSON.parse(dataAccounts);
	const entries = JSON.parse(dataEntries);
	const sources = JSON.parse(dataSources);
	const users = JSON.parse(dataUsers);

	const insertUsers = `
		INSERT INTO users (
			user_id,
			user_name,
			user_email,
			user_password
			)
		VALUES (@id, @name, @email, @password);
		`;

	const insertSources = `
		INSERT INTO sources (
			src_id,
			src_name,
			src_is_debit,
			user_id
			)
		VALUES (@id, @name, @isDebit, @userId);
		`;
	const insertAccounts = `
		INSERT INTO accounts (
			acc_id,
			acc_code,
			acc_name,
			user_id
			)
		VALUES (@id, @code, @name, @userId);
		`;
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
	const insertLineItems = `
		INSERT INTO line_items (
			line_amount,
			acc_id,
			entry_id
			)
		VALUES (@id, @type, @description);
		`;

	buildSchema(schema);

	const userIds = insertModels(insertUsers, users);

	for (const source of sources) {
		source.userId = userIds[0];
		source.isDebit = 1; //sqlite accepts bool as 1 or 'TRUE'
	}
	const srcIds = insertModels(insertSources, sources);

	for (const account of accounts) {
		account.userId = userIds[0];
	}

	const accountIds = insertModels(insertAccounts, accounts);

	for (const reference of references) {
		reference.srcId = srcIds[0];
	}

	insertModels(insertRefs, references);
	insertModels(insertEntries, entries);
};

main();
