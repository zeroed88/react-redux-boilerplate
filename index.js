
const fs = require('fs-extra');
const path = require('path');
const spawn = require('cross-spawn');


const SOURCE_DIR_NAME = 'src';
const DEFAULT_TEMPLATE = 'origin';
const APP_NAME = 'rrb';
const APP_PATH = path.resolve(process.cwd(), 'node_modules', APP_NAME);

const DIRS_NAME = {
 ACTIONS_DIRNAME : 'actions',
 CONST_DIRNAME : 'constants',
 REDUCERS_DIRNAME : 'reducers',
 STORE_DIRNAME : 'store',
 UTILS_DIRNAME : 'utils',
 API_DIRNAME : 'api'
}

let program = require('commander')
  .version(require(path.resolve(APP_PATH, 'package.json')).version)
  .option('--src-dir <src_dir>', 'name for source folder')
  .parse(process.argv)

function createProject(){
  const sourceDirectory = path.resolve(program.src_dir || SOURCE_DIR_NAME);
  if(!pathExist(sourceDirectory)){
      console.log("Can't find " + sourceDirectory);
      process.exit(1)
  }

  const resolvedPaths = Object.keys(DIRS_NAME).reduce((acc, el)=>{
    const curPath = path.resolve(sourceDirectory, DIRS_NAME[el]);
    createDir(curPath);
    acc[el] = curPath;
    return acc;
  }, {});

  applyTemplate(sourceDirectory);
}


function applyTemplate(srcPath, templateName){
  const templatePath = path.resolve(APP_PATH, './templates', templateName || DEFAULT_TEMPLATE);
  const templateSrcPath = path.resolve(templatePath, 'src');
  fs.copy(templateSrcPath, srcPath, (error)=>{
    if (error) return console.error(error);
  })

  installPackages(templatePath);
}


function installPackages(templatePath){
  const deps = require(path.resolve(templatePath, 'template.json')).dependencies;
  deps.forEach((pack)=>{
    install(pack);
  })
}

function install(packageName){
  const args = ['install', '--save', packageName];
  const child = spawn('npm', args, {stdio: 'inherit'});
}

function createDir(path){
  fs.mkdirSync(path)
}

function pathExist(checkingPath){
  return fs.existsSync(checkingPath);
}

module.export = createProject();
