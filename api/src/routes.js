import express from "express"

const routes = express.Router();

const message = {
    user: { id: 1, name: "Derick Souza" },
    course: "Kafka - Node.Js"
}

routes.post("/certifications", async (req, res) => {

    await req.producer.send({
        topic: "issue-certificate",
        messages: [
            {
                value: JSON.stringify(message)
            }
        ]
    })
    return res.json({ ok: true })
})

export default routes