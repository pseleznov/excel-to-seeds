const GENERAL_ITEM_DATA_SHEET_NAME = 'general';
const input = document.getElementById('input');
const convertButton = document.getElementById('convert-button');
const loader = document.getElementById('loader');
const downloaderJSON = document.getElementById('downloader-json');
const downloadButtonJSON = document.getElementById('download-button-json');

convertButton.addEventListener('click', async () => {
  loader.style.display = 'flex';
  const response = await convertFetch(input);
  loader.style.display = 'none';

  if (!response) return;

  console.log(response, 'response');

  let data;

  if (Array.isArray(response)) {
    data = [...response].map(formatFields);
  } else {
    const SHEETS = Object.keys(response);
    const LOCALES = SHEETS.filter(sheet => sheet !== GENERAL_ITEM_DATA_SHEET_NAME);
  
    const { maxLength } = SHEETS.reduce(({ maxLength }, currentKey) => {
      const currentLinesLength = response[currentKey].length;
      if (currentLinesLength > maxLength) {
        return { maxLength: currentLinesLength };
      }
      return { maxLength };
    }, { maxLength: 0 })
  
    data = [...Array(maxLength)].map((_, i) => {
      const item = { ...(response[GENERAL_ITEM_DATA_SHEET_NAME]?.[i] || {}) };
      item.data = {};
      LOCALES.forEach(locale => {
        const formattedItem = formatFields(response[locale]?.[i]);
        item.data[locale] = { ...formattedItem };
      });
      return item;
    });
  }

  console.log(data, 'data');
  
  const dataJSON = JSON.stringify(data);
  const textInBase64 = utf8_to_b64(dataJSON);

  console.log(dataJSON, 'dataJSON');

  downloaderJSON.style.display = 'block';
  downloadButtonJSON.href = 'data:application/octet-stream;charset=utf-16le;base64,' + textInBase64;
});
