const deepCopy = (
  obj: { [x: string]: any; getTime?: any; reduce?: any } | null
) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (Array.isArray(obj)) {
    return obj?.reduce((arr, item, i) => {
      arr[i] = deepCopy(item);
      return arr;
    }, []);
  }

  if (obj instanceof Object) {
    return Object.keys(obj)?.reduce((newObj, key) => {
      newObj[key] = deepCopy(obj[key]);
      return newObj;
    }, {} as { [x: string]: any });
  }
};

export default deepCopy;
