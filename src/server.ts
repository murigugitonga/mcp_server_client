import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
//import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import {z} from "zod"
const server = new McpServer({
    name : "testServer",
    version : "1.0.0",
    capabilities : {
        resources : {},
        tools : {},
        prompts : {},
    }
})

server.tool("create-user", "Create a new user in the database",
    {
    name: z.string()
    email : z.string(),
    address : z.string(),
    phone: z.string
},
{
    title : "Create User",
    readOnlyHint : false,
    destructiveHint : false,
    idempotentHint : false,
    openWorldHint : true
}
, async ()=>{
   try {
    
   } catch (error) {
    return {
        content :[
            {type: "text", text:"failed to save user"}
        ]
    }
   }
})

// Stdio for transport layer for local application

async function main() {
    const transport = new StdioServerTransport()
    await server.connect(transport)
}
main()