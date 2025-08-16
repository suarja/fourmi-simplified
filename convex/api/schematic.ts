import { httpAction } from "../_generated/server";
import { SchematicClient } from "@schematichq/schematic-typescript-node";

const apiKey = process.env.SCHEMATIC_API_KEY;
const schematicClient = new SchematicClient({ apiKey });
// interactions with the client
export const doSomething = httpAction(async () => {
    const resp = await schematicClient.accesstokens.issueTemporaryAccessToken({
        lookup: {
          'demo-id': 'demo-company',
        },
      });
  return new Response();
});

schematicClient.close();
