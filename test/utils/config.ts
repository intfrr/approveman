import { StatusCodes } from "http-status-codes";
import fs from "fs";
import { getGitHubAPIEndpoint } from "./endpoint";
import nock from "nock";
import path from "path";

export const setConfigToBasic = (configId: string): void => {
  const configFileLocation = path.join(
    __dirname,
    "..",
    "fixtures",
    "config",
    `${configId}.yml`,
  );
  /* eslint-disable security/detect-non-literal-fs-filename */
  const rawContent = fs.readFileSync(configFileLocation);
  /* eslint-enable security/detect-non-literal-fs-filename */
  const contentBuf = Buffer.from(rawContent);
  const encodedContent = contentBuf.toString("base64");
  nock(getGitHubAPIEndpoint())
    .get("/repos/tianhaoz95/.github/contents/.github%2Fapproveman.yml")
    .reply(StatusCodes.OK, {
      content: encodedContent,
      encoding: "base64",
      name: "approveman.yml",
      path: ".github/contents/.github/approveman.yml",
      size: encodedContent.length,
      type: "file",
    });
  nock(getGitHubAPIEndpoint())
    .get("/repos/tianhaoz95/approveman-test/contents/.github%2Fapproveman.yml")
    .reply(StatusCodes.NOT_FOUND);
};

export const setConfigNotFound = (): void => {
  nock(getGitHubAPIEndpoint())
    .get("/repos/tianhaoz95/.github/contents/.github%2Fapproveman.yml")
    .reply(StatusCodes.NOT_FOUND);
  nock(getGitHubAPIEndpoint())
    .get("/repos/tianhaoz95/approveman-test/contents/.github%2Fapproveman.yml")
    .reply(StatusCodes.NOT_FOUND);
};
