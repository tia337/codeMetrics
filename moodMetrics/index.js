const fs = require('fs');
const glob = require('glob');

glob(`test/**/*.ts`, {}, (err, files)=>{
  if (!files || files.length === 0) {
    console.log('no files!');
    return;
  }
  readAndParse(files);
});

function readAndParse(files) {
  let parsedForNocAndDit, parsedForMOOD;
  for (const file of files) {
    source = fs.readFileSync(file, 'utf8');
    parsedForNocAndDit = parseForNocAndDit(source);
    parsedForMOOD = source.split(/\r?\n/).filter(s => s !== '');
  }

  countNOC(parsedForNocAndDit);
  countMOOD(parsedForMOOD);
}

function countMOOD(parsedForMOOD) {
  mhf(parsedForMOOD);
  ahf(parsedForMOOD);
  mif(parsedForMOOD);
  aif(parsedForMOOD);
}

function aif(parsedForMOOD) {
  const attributeInheritanceRegex = /super\([a-zA-Z]*\);/;
  const fieldsRegex = /[a-zA-Z]*\:\s[a-zA-Z]*\;/;
  let inheritedCount = 0, allCount = 0;

  for (const line of parsedForMOOD) {
    if (attributeInheritanceRegex.test(line)) inheritedCount++;
    if (fieldsRegex.test(line)) allCount++;
  }
  
  console.log('--------------------------AIF---------------------------');
  console.log(`Attribute inheritance factor: ${((inheritedCount) / (allCount)).toFixed(2)}`);
  console.log(`Inherited attributes: ${inheritedCount}`);
  console.log(`Total attributes: ${allCount}`);
}

function mif(parsedForMOOD) {
  const methodInheritanceRegex = /super.[a-zA-Z]*\([a-zA-Z]*\)*/;
  const methodsRegex = /(private|public|protected) [a-zA-Z]*\s*\(([^),]*)\)()/;
  let inheritedCount = 0, allCount = 0;

  for (const line of parsedForMOOD) {
    if (methodInheritanceRegex.test(line)) inheritedCount++;
    if (methodsRegex.test(line)) allCount++;
  }
  
  console.log('--------------------------MIF---------------------------');
  console.log(`Method inheritance factor: ${((inheritedCount) / (allCount)).toFixed(2)}`);
  console.log(`Inherited methods: ${inheritedCount}`);
  console.log(`Total methods: ${allCount}`);
}

function ahf(parsedForMOOD) {
  const privateFieldsRegex = /private [a-zA-Z]*\s*\: [a-zA-Z]*/;
  const fieldsRegex = /public [a-zA-Z]*\s*\:\s[a-zA-Z]*\s=\s[a-zA-Z]*/;

  let privateCount = 0, publicCount = 0;

  for (const line of parsedForMOOD) {
    if (privateFieldsRegex.test(line)) privateCount++;
    if (fieldsRegex.test(line)) publicCount++;
  }
  
  console.log('--------------------------AHF---------------------------');
  console.log(`Attribute hiding factor: ${(privateCount / (privateCount + publicCount)).toFixed(2)}`);
  console.log(`Private attributes: ${privateCount}`);
  console.log(`Public attributes: ${publicCount}`);
}

function mhf(parsedForMOOD) {
  const privateMethodsRegex = /private [a-zA-Z]*\s*\(([^),]*)\)()/;
  const methodsRegex = /(private|public|protected) [a-zA-Z]*\s*\(([^),]*)\)()/;

  let privateCount = 0, publicCount = 0;

  for (const line of parsedForMOOD) {
    if (privateMethodsRegex.test(line)) privateCount++;
    if (methodsRegex.test(line)) publicCount++;
  }

  console.log('--------------------------MHF---------------------------');
  console.log(`Method hiding factor: ${(privateCount / (privateCount + publicCount)).toFixed(2)}`);
  console.log(`Private methods: ${privateCount}`);
  console.log(`Public methods: ${publicCount}`);
}

function countNOC(parentChildArr) {
  let temp = [];
  let res = [];
  let uniqueMap = new Map();

  for(let el of parentChildArr) {
    let noc = 0;
    parentChildArr.forEach(e => {
      if (el.parent === e.parent && el.parent !== e.child) {
        noc++;
        temp.push({
          class: el.parent,
          noc: noc
        });
      }
    })
  }

  // for (let i = 0; i < temp.length - 1; i++) {
  //   if (temp[i].class === temp[i+1].class && temp[i].noc >= temp[i+1].noc) {
  //     res.push(temp[i]);
  //   }
  // }

  //we need only unique elements in Map
  temp.forEach(
    e => !uniqueMap.has(e.class) ? uniqueMap.set(`${e.class} NOC`, e.noc) : null
  );

  console.log('--------------------------NOC---------------------------');
  console.log('NOC res:');
  console.log(uniqueMap);
}

function parseForNocAndDit(source) {
  let test = source.split(/\r?\n/);
  let res = [];
  test.forEach(el => {
    if (el.startsWith('class') && !el.includes('(')) {
      let components = el.split(' ');
      res.push({
        parent: components[3] ? components[3] : components[1],
        child: components[1]
      });
    }
  })
  return res;
}
