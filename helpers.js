async function convertFetch(input) {
  const file = input.files[0];

  if (!file) return;

  const formData = new FormData();
  formData.append('key', file);
  formData.append('UploadOptions', 'XLSX,XLS,XLSB,XLSM,ODS');

  let response = null;
  
  await fetch(
    'https://api.products.aspose.app/cells/conversion/api/ConversionApi/Convert?outputType=JSON',
    {
      method: 'POST',
      body: formData
    }
  )
  .then((res) => res.json())
  .then((data) => {
    const json = data.Text;
    response = JSON.parse(json);
  })
  .catch(err => console.error(err));

  return response;
}

function utf8_to_b64(str) {
  return window.btoa(window.unescape(encodeURIComponent(str)));
}

const deepSet = (obj, path, val) => {
  path = path.replaceAll("[", ".[");
  const keys = path.split(".");

  for (let i = 0; i < keys.length; i++) {
      let currentKey = keys[i];
      let nextKey = keys[i + 1];
      if (currentKey.includes("[")) {
          currentKey = parseInt(currentKey.substring(1, currentKey.length - 1));
      }
      if (nextKey && nextKey.includes("[")) {
          nextKey = parseInt(nextKey.substring(1, nextKey.length - 1));
      }

      if (typeof nextKey !== "undefined") {
          obj[currentKey] = obj[currentKey] ? obj[currentKey] : (isNaN(nextKey) ? {} : []);
      } else {
          obj[currentKey] = val;
      }

      obj = obj[currentKey];
  }
};

function formatFields(item = {}) {
  return Object.keys(item).reduce((obj, key) => {
    if (key.includes('.')) {
      const newObj = {...obj };
      deepSet(newObj, key, item[key]);
  
      return newObj;
    }
    return {
      ...obj,
      [key]: item[key]
    }
  }, {})
}
