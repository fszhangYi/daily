import OpenAI from "openai";

const apiKey = 'zXLFpEgwQkMi3j3Oq7AMEgrqS5rXXJOC';
const city = '101210114';

const getWeather = async () => {
  // 使用fetch发送请求
  const {result:{daily_fcsts}} = await fetch(`https://gfapi.mlogcn.com/weather/v001/day?areacode=${city}&days=1&key=${apiKey}&output_type=json`).then(d=>d.json())
  const rst = daily_fcsts[0];
  return rst;
}

const formatContent = async (content: any) => {
  const openai = new OpenAI({
    apiKey: 'sk-7HFYCtmUItc9Y2MG8642E896C61a42Aa87D3Cc7a16256b92',
    baseURL: 'https://api.xjai.cc/v1',
    dangerouslyAllowBrowser: true,
  });

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: `
    请将下面的日报内容格式化成markdown格式之后返回,返回格式应该是英文，并且不要有任何多余的文字：
    ${content}
    ` }],
    model: "gpt-4",
  });
  return completion.choices[0] as unknown as string;
}

export {
  getWeather,
  formatContent,
}