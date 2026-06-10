import serverless from "serverless-http";
import { app } from "../../server";

// Wrap our existing Express app in serverless-http
export const handler = serverless(app);
