export const ArrayToJson = (data: any[][]) => {
  const keys = data[0];

  data.shift();

  const jsonData = data.map(function (row) {
    const obj = {};
    for (let i = 0; i < keys.length; i++) {
      obj[keys[i]] = row[i];
    }
    return obj;
  });

  return jsonData;
};
