const matchedData = (arr1: any[], arr2: any[]) => {
  return arr1?.filter((item) => {
    return arr2?.some((value) => value === item._id);
  });
};

export default matchedData;
