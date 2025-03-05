/*Parsing을 위한 작업 */

async function parseData() {
  const link = document.querySelector('head > meta[name$=url]').content.replace(/\?.*/g, '').trim();
  const problemId = document.querySelector('div.main > div.lesson-content').getAttribute('data-lesson-id');
  const level = document.querySelector('body > div.main > div.lesson-content').getAttribute("data-challenge-level")
  const division = [...document.querySelector('ol.breadcrumb').childNodes]
      .filter((x) => x.className !== 'active')
      .map((x) => x.innerText)
      .map((x) => convertSingleCharToDoubleChar(x))
      .reduce((a, b) => `${a}/${b}`);

  const title = document.querySelector('.nav-item.algorithm-nav-link.algorithm-title.active .challenge-title').textContent.trim();
  const problem_description = document.querySelector('div.guide-section-description > div.markdown').innerHTML;
  const language_extension = document.querySelector('div.editor > ul > li.nav-item > a').innerText.split('.')[1];
  const code = '```java\n' + document.querySelector('textarea#code').value;
  const result_message =
      [...document.querySelectorAll('#output .console-message')]
          .map((node) => node.textContent)
          .filter((text) => text.includes(':'))
          .reduce((cur, next) => (cur ? `${cur}<br/>${next}` : next), '') || 'Empty';
  const [runtime, memory] = [...document.querySelectorAll('td.result.passed')]
      .map((x) => x.innerText)
      .map((x) => x.replace(/[^., 0-9a-zA-Z]/g, '').trim())
      .map((x) => x.split(', '))
      .reduce((x, y) => (Number(x[0]) > Number(y[0]) ? x : y), ['0.00ms', '0.0MB'])
      .map((x) => x.replace(/(?<=[0-9])(?=[A-Za-z])/, ' '));

  return makeData({ link, problemId, level, title, problem_description, division, language_extension, code, result_message, runtime, memory });
}

/*서버로 보내는 Data 정제 작업*/ 
async function makeData(origin) {
  const { link, problem_description, problemId, level, result_message, division, language_extension, title, runtime, memory, code } = origin;
  const levelWithLv = `${level}`.includes('lv') ? level : `lv${level}`.replace('lv', 'level ');
  const message = `Time: ${runtime}, Memory: ${memory}`;
  const dateInfo = getDateString(new Date(Date.now()));
  const fileName = `${convertSingleCharToDoubleChar(title)}.${language_extension}`;
  const problemTitle = `[${levelWithLv}] ${title} - ${problemId}`
  const resultDay = `${dateInfo}`  
  const resultMessage = `${result_message}`
  const readme = `${problem_description}\n\n`
  return { problemTitle, problemId, message, fileName, readme, code, level, resultDay, resultMessage};
}