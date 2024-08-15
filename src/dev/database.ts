import { getData } from './utilDb.js';
import { execTransaction, execTransactionBound } from './utilDb.js';
import { parseQueries, parseCsv, parseOfx } from './utilParse.js';

const main = async () => {
	const fileNames = {
		schema: './src/models/schema.sql',
		reference: './src/models/schema.sql',
		account: './src/models/schema.sql',
		entry: './src/models/schema.sql',
		source: './src/models/schema.sql',
		user: './src/models/schema.sql',
	};

	const data: string[] = [];

	try {
		data.push(
			...(<string[]>(
				await Promise.all(
					getData([
						'./src/models/schema.sql',
						'./testInputs/transactions.csv',
						'./testInputs/accounts.json',
						'./testInputs/entries.json',
						'./testInputs/sources.json',
						'./testInputs/users.json',
					]),
				)
			)),
		);
	} catch (err) {
		console.log(err);
	}

	const [
		schemaData,
		referenceData,
		accountData,
		entryData,
		sourceData,
		userData,
	] = data;

	const createSchema = parseQueries(schemaData);
	execTransaction(createSchema);

	const users = JSON.parse(userData);
	const insertUsers = `
		INSERT INTO users (
			user_id,
			user_name,
			user_email,
			user_password
			)
		VALUES (@id, @name, @email, @password);
		`;
	const userIds = execTransactionBound(insertUsers, users);

	//need to add userId
	const sources = JSON.parse(sourceData);
	for (const source of sources) {
		source.userId = userIds[0];
		source.isDebit = 1; //sqlite accepts bool as 1 or 'TRUE'
	}

	const insertSources = `
		INSERT INTO sources (
			src_id,
			src_name,
			src_is_debit,
			user_id
			)
		VALUES (@id, @name, @isDebit, @userId);
		`;
	const srcIds = execTransactionBound(insertSources, sources);

	//need to add userId
	const accounts = JSON.parse(accountData);
	for (const account of accounts) {
		account.userId = userIds[0];
	}
	const insertAccounts = `
		INSERT INTO accounts (
			acc_id,
			acc_code,
			acc_name,
			user_id
			)
		VALUES (@id, @code, @name, @userId);
		`;
	const accountIds = execTransactionBound(insertAccounts, accounts);

	//need to add srcId
	const references = parseCsv(referenceData);
	for (const reference of references) {
		reference.srcId = srcIds[0];
	}
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
	execTransactionBound(insertRefs, references);

	const entries = JSON.parse(entryData);
	const insertEntries = `
		INSERT INTO entries (
			entry_id,
			entry_type,
			entry_description
			)
		VALUES (@id, @type, @description);
		`;
	execTransactionBound(insertEntries, entries);

	//need to add accId and entryId
	const insertLineItems = `
		INSERT INTO line_items (
			line_amount,
			acc_id,
			entry_id
			)
		VALUES (@id, @type, @description);
		`;
};

main();
