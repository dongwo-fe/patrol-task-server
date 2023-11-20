let list = [1, 7, 3, 4];

list.sort((a, b) => {
    return b - a;
});

// console.log(list);
const API_ERROR_List = new Map();
API_ERROR_List.set('a', 'aaa');
API_ERROR_List.set('b', 'ab');
console.log(Array.from(API_ERROR_List.values()));
