const apiKey = 'zXLFpEgwQkMi3j3Oq7AMEgrqS5rXXJOC';
const city = '101210114';

const getWeather = async () => {
  // 使用fetch发送请求
  const {result:{daily_fcsts}} = await fetch(`https://gfapi.mlogcn.com/weather/v001/day?areacode=${city}&days=1&key=${apiKey}&output_type=json`).then(d=>d.json())
  const rst = daily_fcsts[0];
  return rst;
}

export {getWeather}