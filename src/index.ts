import { runServer } from "./server";

runServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
