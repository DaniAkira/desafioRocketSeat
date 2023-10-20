import fs from 'fs'
import parse from 'csv-parse'
import fetch from 'node-fetch'

export async function processCSV(csvFilePath) {
    const csv = fs.createReadStream(csvFilePath).pipe(parse({delimiter: ','}))

    for await (const task of csv) {
        const [title, description] = task

        const taskData = {
            title,
            description,
        }

        try {
            const response = await fetch('http://localhost:8080/tasks', {
                method: "POST",
                body: JSON.stringify(taskData),
                headers: { 'content-Type': 'application/json'},
            })

            if(response.status === 200) {
                console.log("task adicionada com sucesso", taskData)
            } else {
                console.log("Erro ao adicionar task", response.status)
            }
        } catch (error) {
            console.error('Erro na requisição', error)
        }
    }
}