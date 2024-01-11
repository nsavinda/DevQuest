import { request } from "https";
const REPO_FILE = "./repo.txt";
import xml2js from "xml2js";
const UNIT_TEST_RESULT_PATH = "../junit.xml";
import fs from "fs";
import { scores } from "./scores.js";

const getXMLData = () => {
  return fs.readFileSync(UNIT_TEST_RESULT_PATH, "utf8");
};

const testResultsToJson = (xmlData) => {
  const parser = new xml2js.Parser();
  return parser.parseStringPromise(xmlData);
};

const getJsonTestResults = async () => {
  const xmlData = getXMLData();
  return testResultsToJson(xmlData);
};

const postData = async () => {
  const repoName = process.env.CODE_COMMIT_REPO;
  const unitTest = await getJsonTestResults();
  const { tests, failures } = unitTest.testsuites.$;

  const summary = {
    date: new Date(),
    tests: tests - 3,
    failures,
  };

  let result;
  let currentTestCase;
  let scoreData;
  const testResults = unitTest.testsuites.testsuite;
  const bugFixing = [];
  const featureImplementation = [];

  for (result in testResults) {
    currentTestCase = testResults[result].testcase;

    for (let testcaseIndex in currentTestCase) {
      scoreData = scores.bugs.find((score) => {
        return currentTestCase[testcaseIndex].$.name === score.desc;
      });
      if (scoreData === undefined) {
        scoreData = scores.features.find((score) => {
          return currentTestCase[testcaseIndex].$.name === score.desc;
        });
        if (scoreData !== undefined) {
          featureImplementation.push({
            fullName: currentTestCase[testcaseIndex].$.name,
            success: currentTestCase[testcaseIndex].failure ? false : true,
            score: scoreData.score,
          });
        }
      } else {
        bugFixing.push({
          fullName: currentTestCase[testcaseIndex].$.name,
          success: currentTestCase[testcaseIndex].failure ? false : true,
          score: scoreData.score,
        });
      }
    }
  }
  const params = {
    repoName,
    summary,
    bugFixing,
    featureImplementation,
  };
  return params;
};

const sendReportData = async () => {
  const data = await postData();
  console.log(data);
  const options = {
    hostname: "dev.devgrade.io",
    path: "/assessments/report",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(JSON.stringify(data)),
    },
  };

  const req = request(options, (res) => {});
  req.write(JSON.stringify(data));
  req.end();
};

sendReportData();
