import { MongoClient } from "mongo";
import { PrismaClient } from '../../generated/client/deno/edge.ts'
import appEnv from "../app-env.ts";

const { MONGODB_URI } = appEnv;

// const client = new MongoClient();

// if (!MONGODB_URI) {
//   console.error(`MONGODB Uri missing. Exiting.`);
//   Deno.exit(1);
// }

// await client.connect(MONGODB_URI);
// const database = client.database("TODO_APP");

const kv = await Deno.openKv()
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: appEnv.MONGODB_URI,
    },
  },
}).$extends({
  query: {
    async $allOperations({ model, operation, args, query }) {
      console.log(model, operation, args /*, query */)

      let result = null

      /*
       if (operation === 'delete') {
        const res = await kv.delete(["dinosaurs", args.where.id])
        console.log(res)
        result = res
      } else */ 
      if (operation === 'findUnique') {
        const res = await kv.get([model, args.where.id])
        console.log(res)
        result = res.value
      } else if (operation === 'create') {
        if (!args.data.id) {
          args.data.id = crypto.randomUUID()
        }
        const res = await kv.set([model, args.data.id], args.data)
        console.log(res)
        console.log("created", args.data)
        result = args.data
      } else if (operation === 'update') {
        const res = await kv.get([model, args.where.id])
        const modelValue = res.value
        console.log("before", modelValue)
        // update object
        Object.assign(modelValue, args.data);
        console.log("after", modelValue)
        const res2 = await kv.set([model, modelValue.id], modelValue)
        console.log(res2)
        console.log("created", modelValue)
        result = modelValue
      } else if (operation === 'findMany') {
        const iter = kv.list<string>({ prefix: [model] });
        result = [];
        for await (const res of iter) { console.log(res); result.push(res.value); }
        console.log({ result })
      } else {
        throw Error(`Operation ${operation} not implemented yet.`)
      }

      return Promise.resolve(result)
      //return query(args)
    },
  },
});

export default prisma;
