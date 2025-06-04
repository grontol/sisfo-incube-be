import cors from 'cors'
import express, { json } from 'express'
import { networkInterfaces } from "os"

const app = express()
app.use(json())
app.use(cors())

app.get('/', (req, res) => {
    res.json({
        success: true,
        data: "Server OK"
    })
})

app.post('/login', (req, res) => {
    const { username, password } = req.body
    
    if (username === "rio" && password === "123456") {
        res.json({
            success: true,
            message: "Ok",
            data: {
                username,
                password,
            }
        })
    }
    else {
        res.json({
            success: false,
            message: "Username atau password salah",
            data: null
        })
    }
})

type Faskes = {
    id: number,
    nama: string,
    alamat: string,
}

const faskeses: Faskes[] = [
    { id: 1, nama: "Ugm Faskes 1", alamat: "Jl Bougenvile No 9", },
    { id: 2, nama: "RS Sardjito", alamat: "Jl Sardjito No 90", },
    { id: 3, nama: "RSGM Soedomo", alamat: "Jl Soedomo No 78", },
    { id: 4, nama: "Jogja International Hospital", alamat: "Jl Ringroad utara", },
    { id: 5, nama: "", alamat: "Jl Ringroad utara", },
]

app.get('/search_faskes/:search', (req, res) => {
    const search = req.params.search.toLowerCase()
    
    res.json({
        success: true,
        data: faskeses.filter(x => {
            return x.nama.toLowerCase().includes(search)
        })
    })
})

const port = 8000
console.log(`Listening on http://${getIp()}:${port}`)
app.listen(port, '192.168.100.21')

function getIp() {
    const nets = networkInterfaces()
    
    for (const name of Object.keys(nets)) {
        for (const net of nets[name] ?? []) {
            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
            if (net.family === familyV4Value && !net.internal) {
                return net.address
            }
        }
    }
    
    return null
}