export * from './api';

const removeDuplicate = (data: any[]) => {
    if (!Array.isArray(data)) return [];
    const _map = new Map();
    data.forEach(
        d => {
            _map.set(d?.name, d?.content);
        }
    );
    const _rst: any = [];
    _map.forEach((value, key) => {
        if(key!=='undefiend') _rst.push({ name: key, content: value })
    });

    return _rst;
}

export {removeDuplicate}