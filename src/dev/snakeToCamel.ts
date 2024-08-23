export const removeDbPrefix = (input: string): string => {
	const index = input.indexOf('_');

	return input.slice(index + 1, input.length);
};

export const snakeToCamel = (input: string): string => {
	const index = input.indexOf('_');

	if (index === -1) return input;

	const modifiedInput =
		input.slice(0, index) +
		input[index + 1].toUpperCase() +
		input.slice(index + 2, input.length);

	return snakeToCamel(modifiedInput);
};
