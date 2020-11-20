import { Application, Router, send } from "https://deno.land/x/oak@v6.3.1/mod.ts";

let cards = [];
let id = 0;

const app = new Application();
const router = new Router();

router
    .get("/cards", (context) => context.response.body = cards)
    .post("/cards", async (context) => {
        const card = await context.request.body({type: "json"}).value;
        card.id = id;
        id++;
        cards = [
            ...cards,
            card
        ]
        context.response.body = "Created new Task";
        context.response.status = 201;
    })
    .put("/cards/:id", async context => {
        const id = context.params.id;
        const card = await context.request.body({type: "json"}).value;
        const oldCard = cards.find(card => card.id == id);
        const index = cards.indexOf(oldCard);
        card.id = parseInt(id, 10);
        cards[index] = card
        context.response.body = "Task updated";
        context.response.status = 200;
    })
    .delete("/cards/:id", async context => {
        const id = context.params.id;
        cards = cards.filter(card => card.id != id);
        context.response.body = "Task deleted";
        context.response.status = 200;
    })
    .get("/styles/:fileName", (context) => {
        const fileName = context.params.fileName;
        return send(context, `../frontend/styles/${fileName}`);
    })
    .get("/", async context => {
        await send(context, context.request.url.pathname, {
            root: `${Deno.cwd()}/frontend`,
            index: 'index.html'
        })
    })

app.use(router.routes());    
app.listen({port:8000});
