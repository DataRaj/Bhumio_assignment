function mergeObjects(objects) {
  const mergedObject = {};

  for (const obj of objects) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && !mergedObject.hasOwnProperty(key)) {
        mergedObject[key] = obj[key];
      }
    }
  }
  return mergedObject;
}

function removeKeys(index, data) {
  const mergedObject = {};

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      if (data[key][index]) {
        mergedObject[key] = { ...data[key][index] };
      }
    }
  }

  const result = mergeObjects(Object.values(mergedObject));

  return result;
}

export function mergeEntitiesByIndex(data: any) {
  const arrayLength = data.patient.length;
  const mergedArray: Record<string, any>[] = [];

  for (let i = 0; i < arrayLength; i++) {
    const mergedObject = removeKeys(i, data);
    mergedArray.push(mergedObject);
  }
  return mergedArray;
}


