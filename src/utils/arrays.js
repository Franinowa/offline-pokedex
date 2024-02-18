export async function asyncMap(data, callback) {
	return await Promise.all(data.map((...args) => callback(...args)));
}