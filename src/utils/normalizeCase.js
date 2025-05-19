// utils/normalizeCase.js
export const normalizeKeys = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(normalizeKeys);
    } else if (obj !== null && typeof obj === 'object') {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            acc[key.toLowerCase()] = normalizeKeys(value);
            return acc;
        }, {});
    }
    return obj;
};