import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
//import fs from "node:fs/promises"
//import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import {string, z} from "zod"

import fs from "node:fs/promises"

const server = new McpServer({
    name : "firstServer",
    version: "1.0.0",
    capabilities:{
        resources: {},
        tools: {},
        prompts: {},
    }
})

// Creating the tool
server.tool("create-user", "Create a new user in the database",
    {
    name : z.string(),
    email : z.string(),
    address : z.string(),
    phone: z.string()
},
// {
//     title : "Create User",
//     readOnlyHint : false,
//     destructiveHint : false,
//     idempotentHint : false,
//     openWorldHint : true
// },
 async (params)=>{
   try {
    const id = await createUser({
      name: params.name,
      email: params.email,
      phone: params.phone
    })
    return {
        content :[
            {type: "text", text:`User${id} created successfully`},
        ]
    }
   } catch {
    return {
        content :[
            {type: "text", text:"failed to save user"}
        ]
    }
   }
})

async function createUser(user:{
    name : string,
    email : string,
    phone : string,
}) {
     const users = await import("./data/users.json", {
        with : {type : "json"}
     }).then( m => m.default)

     const id = users.length + 1
     users.push({ id, ...user })

     await fs.writeFile("./src/data/users.json", JSON.stringify(users,null, 2)) // append record to JSON source

     return id
}

// Stdio transport layer for local application
(async function main() {
    // transport protocol
    const transport = new StdioServerTransport() // local communication
    await server.connect(transport)
}())

//main()