const glob = require('glob');
const path = require('path');
const fs = require('fs');

const regexpStorage = {
  removeRegex: /@\/(?:[^\/]+|\/\/)*\/|\/(?:[^\/\\]+|\\.)\//gm,
  removeComments: /(\/\*[\s\S]*?\*\/|(|^)\/\/.*$)/gm,
  removeStringDoubleQuotes: /@"(?:[^"]+|"")*"|"(?:[^"\\]+|\\.)"/gm,
  removeStringSingQuotes: /@'(?:[^']+|'')*'|'(?:[^'\\]+|\\.)'/gm,
  openBracket: /\(/gm,
  closingBracket: /\)/gm,
  notSymbol: /!/gm,
  questionSymbol: /\?/gm,
  colonSymbol: /:/gm,
  equalSymbol: /=/gm,
  return: /return/gm,
  break: /break/gm,
  continue: /continue/gm,
  else: /else/gm,
  try: /try/gm,
  catch: /catch/gm,
  switch: /switch/gm
}

run();

async function run() {

  let metrics = {
    totalLines: 0,
    codeLines: 0,
    emptyLines: 0,
    commentLines: 0,
    sourceLines: 0,
    commentsLevel: 0,
  };
  await readInputFiles('./test', metrics);

  console.log(metrics);
};


async function getSourceFilePaths(dir) {
  return new Promise((resolve, reject) => {
    glob(dir + '/**/*.js', (error, files) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(files.map(filePath => path.join(process.cwd(), filePath)));
    });
  });
}

async function readInputFiles(dirname, metrics) {
  let filenames = await getSourceFilePaths(dirname);
  for (const filename of filenames) {
    const source = fs.readFileSync(filename);
    const fileMetrics = calculateMetrics(source.toString());
    metrics.totalLines += fileMetrics.totalLines;
    metrics.codeLines += fileMetrics.codeLines;
    metrics.emptyLines += fileMetrics.emptyLines;
    metrics.commentLines += fileMetrics.commentLines;
    metrics.sourceLines += calculateLogicLines(source.toString());

  }
  metrics.commentsLevel = Number((metrics.commentLines / metrics.codeLines).toFixed(2));
}

function calculateMetrics(contentString) {
  const lines = contentString.split('\n');
  const notEmptyLines = lines.filter(el => el !== '');
  let commentLines = 0;
  let hasComment = false;
  lines.forEach(line => {
    
    if(line.includes('//')) commentLines++;

     // for block comments
    if (line.includes('/*')) { 
      hasComment = true;
    } else if (hasComment) {
      commentLines++;
      if (line.includes('*/')) {
        hasComment = false;
      }
    }

  });
  return {
    totalLines: lines.length,
    codeLines: notEmptyLines.length,
    emptyLines: lines.length - notEmptyLines.length,
    commentLines: commentLines,
  };
}

function calculateLogicLines(contentString) {
  contentString = rmoveTrash(contentString);

  const openBracketsCount = 
    (contentString.match(regexpStorage.openBracket) || []).length;

  const closeBracketsCount = (contentString.match() || []).length;
  const notSymbolCount = (contentString.match(regexpStorage.notSymbol) || []).length;
  const questionSymbolCount = (contentString.match(regexpStorage.questionSymbol) || []).length;
  const colonSymbolCount = (contentString.match(regexpStorage.colonSymbol) || []).length;
  const equalCount = (contentString.match(regexpStorage.equalSymbol) || []).length;
  const returnCount = (contentString.match(regexpStorage.return) || []).length;
  const breakCount = (contentString.match(regexpStorage.break) || []).length;
  const continueCount = (contentString.match(regexpStorage.continue) || []).length;
  const elseCount = (contentString.match(regexpStorage.elseCount) || []).length;
  const switchCount = (contentString.match(regexpStorage.switch) || []).length;
  const tryCount = (contentString.match(regexpStorage.try) || []).length;
  const catchCount = (contentString.match(regexpStorage.catch) || []).length;

  const functionsCount = 
    openBracketsCount === closeBracketsCount ? 
    openBracketsCount : Math.min(openBracketsCount, closeBracketsCount);

  return functionsCount + notSymbolCount + questionSymbolCount + colonSymbolCount + returnCount +
    breakCount + continueCount + elseCount + switchCount + tryCount + catchCount + equalCount;
}

function rmoveTrash(contentString) {
  if (contentString.search(regexpStorage.removeRegex) >= 0) {
    contentString = contentString.replace(regexpStorage.removeRegex, ''); 
  }
  if (contentString.search(regexpStorage.removeComments) >= 0) {
    contentString = contentString.replace(regexpStorage.removeComments, ''); 
  }
  if (contentString.search(regexpStorage.removeStringDoubleQuotes) >= 0) {
    contentString = contentString.replace(regexpStorage.removeStringDoubleQuotes, ''); 
  }
  if (contentString.search(regexpStorage.removeStringSingQuotes)>= 0) {
    contentString = contentString.replace(regexpStorage.removeStringSingQuotes, ''); 
  }

  return contentString;
}
