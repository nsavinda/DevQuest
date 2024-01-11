import fs from 'fs';
import tar from 'tar';
import YAML from 'yaml';
import AWS from 'aws-sdk';
import glob from 'glob';
import rimraf from 'rimraf';


const s3 = new AWS.S3();
const TESTS_BUCKET = "devgrade-assessment-templates-original-tests";
const TESTS_FOLDER = "original_tests";

const injectFiles = (configFileName) => {
    if (fs.existsSync(configFileName)) {
        const configFile = fs.readFileSync(configFileName, 'utf8');
        const config = YAML.parse(configFile);
        const { test_files, template_name, stack } = config
        const objectKey = `${template_name}.tar.gz`

        const params = {
            Bucket: TESTS_BUCKET,
            Key: objectKey,
        }

        s3.getObject(params).createReadStream().pipe(fs.createWriteStream(objectKey)).on("close", () => {

            if (!fs.existsSync(TESTS_FOLDER)) {
                fs.mkdirSync(TESTS_FOLDER);
            }

            fs.createReadStream(objectKey).pipe(tar.extract({ cwd: `./${TESTS_FOLDER}` })).on('close', () => {
                fs.unlink(objectKey, (err) => {
                    if (err) throw err;
                    replaceFiles(test_files);
                });
            })
        });
        return "Files Injected Successfully";
    } else {
        return "File Injection Error";
    }
}

const replaceFiles = (test_files) => {
    if (test_files.length != 0) {
        for (const testFilePath of test_files) {
            if (testFilePath.includes("*")) {
                const options = {
                    cwd: "../",
                    ignore: ["node_modules/**", "config/**"]
                }
                glob(testFilePath, options, function (er, currentFilePaths) {
                    for (const path of currentFilePaths) {
                        const fileName = path.split("/")[path.split("/").length - 1];
                        fs.readdir(`./${TESTS_FOLDER}/99x-Hacktitude-Malaysia-2023-javascript/tests`, (err, originalFiles) => {
                            if (originalFiles.includes(fileName)) {
                                copyFile(fileName, path);
                                rimraf(TESTS_FOLDER, function () { console.log("test files replaced"); });
                            }
                        })
                    }
                })
            } else {
                const fileName = testFilePath.split("/")[testFilePath.split("/").length - 1];
                copyFile(fileName, testFilePath);
                rimraf(TESTS_FOLDER, function () { console.log("original tests removed"); });
            }
        }
        return "Files Copied";
    } else {
        return "Error File Copying";
    }
}

const copyFile = (srcFileName, destPath) => {
    fs.copyFile(`${TESTS_FOLDER}/99x-Hacktitude-Malaysia-2023-javascript/tests/${srcFileName}`, `../${destPath}`, (err) => {
        if (err) throw err;
    });
    return "Copied";
}

injectFiles("./devgradeconfig.yml");

export { copyFile, replaceFiles, injectFiles };