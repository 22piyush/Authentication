import { app } from "./app.js";

app.listen(process.env.PORT, () => {
    console.log(`Server listening on PORT ${process.env.PORT}`);
});

