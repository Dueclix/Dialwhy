export const roundOff = (number, count = 2) => {
    return parseFloat(number).toFixed(count);
};
export const discount = (price, oldPrice) => oldPrice ? roundOff(100 * (oldPrice - price) / oldPrice) : 0
const dev = process.env.NODE_ENV !== "production";
export const server = dev ? "http://localhost:3000" : "https://hospitania.vercel.app";

// Delete Product from List By Id
export const deleteProduct = (list, id) => {
    const filter = list.filter((item) => item._id !== id);
    return filter;
};

// Find Product Index From List
export const findProductIndex = (list, slug) => {
    const index = list.findIndex((item) => item.slug === slug);
    return index;
};
export const findProductIndexById = (list, id) => {
    const index = list.findIndex((item) => item._id === id);
    return index;
};
