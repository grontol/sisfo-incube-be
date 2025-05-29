import cors from 'cors'
import express, { json } from 'express'
import z, { ZodError } from "zod"

const app = express()
app.use(json())
app.use(cors())

app.get('/', (req, res) => {
    res.json({
        success: true,
        data: "Server OK"
    })
})

const zObat = z.object({
    id: z.number(),
    nama: z.string(),
    harga: z.number(),
    jenis: z.string(),
    satuan: z.string(),
})

const zObatInsert = z.object({
    nama: z.string(),
    harga: z.number(),
    jenis: z.string(),
    satuan: z.string(),
})

type ObatData = z.infer<typeof zObat>
type ObatInsertData = z.infer<typeof zObatInsert>

const obats: ObatData[] = [
    {
        id: 1,
        nama: "Kunyuk",
        harga: 10000,
        jenis: "Biologis",
        satuan: "mm",
    }
]
let id = obats.length

app.get('/obat', (req, res) => {
    res.json(obats)
})

app.post('/obat', (req, res) => {
    try {
        const data = zObatInsert.parse(req.body)
        const newData = {
            ...data,
            id: ++id,
        }
        obats.push(newData)
        res.json(newData)
    }
    catch (e: any) {
        if (e instanceof ZodError) {
            res.status(401).json({
                success: false,
                error: e.message
            })
        }
        else {
            res.status(401).json({
                success: false,
                error: "Invalid body"
            })
        }
    }
})

app.put('/obat/:id', (req, res) => {
    try {
        const id = req.params.id
        const data = zObatInsert.parse(req.body)
        const index = obats.findIndex(x => x.id === +id)
        if (index < 0) {
            res.status(404).json({
                success: false,
                error: "Data not found"
            })
        }
        else {
            obats[index] = {
                ...data,
                id: +id,
            }
            
            res.json({
                success: true,
                data: "OK",
            })
        }
    }
    catch (e: any) {
        if (e instanceof ZodError) {
            res.status(401).json({
                success: false,
                error: e.message
            })
        }
        else {
            res.status(401).json({
                success: false,
                error: "Invalid body"
            })
        }
    }
})

app.delete('/obat/:id', (req, res) => {
    try {
        const id = req.params.id
        const index = obats.findIndex(x => x.id === +id)
        if (index < 0) {
            res.status(404).json({
                success: false,
                error: "Data not found"
            })
        }
        else {
            obats.splice(index, 1)
            
            res.json({
                success: true,
                data: "Deleted",
            })
        }
    }
    catch (e: any) {
        if (e instanceof ZodError) {
            res.status(401).json({
                success: false,
                error: e.message
            })
        }
        else {
            res.status(401).json({
                success: false,
                error: "Invalid body"
            })
        }
    }
})

console.log("Listening on localhost:8000")
app.listen(8000)