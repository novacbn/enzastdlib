export function deleteUndefined<T>(obj: T): T {
    for (const key in obj) {
        if (obj[key] === undefined) delete obj[key];
    }

    return obj;
}
