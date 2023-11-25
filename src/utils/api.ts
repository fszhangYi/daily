import OpenAI from "openai";

const apiKey = process.env.REACT_APP_WEATHER_KEY;
const city = process.env.REACT_APP_WEATHER_CITY;
const openaiKey = process.env.REACT_APP_OPENAI_KEY;
const openaiBase = process.env.REACT_APP_OPENAI_BASE;

const getWeather = async () => {
  // 使用fetch发送请求
  const {result:{daily_fcsts}} = await fetch(`https://gfapi.mlogcn.com/weather/v001/day?areacode=${city}&days=1&key=${apiKey}&output_type=json`).then(d=>d.json())
  const rst = daily_fcsts[0];
  return rst;
}

const formatContent = async (content: any) => {
  const openai = new OpenAI({
    apiKey: openaiKey,
    baseURL: openaiBase,
    dangerouslyAllowBrowser: true,
  });

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: `
    请将下面的日报内容格式化成markdown格式之后返回,返回格式应该是英文，不要有任何多余的文字：
    ${content}
    ` }],
    model: "gpt-4",
  });
  const rst = completion?.choices[0] as unknown as string
  return  rst;
}

export {
  getWeather,
  formatContent,
}