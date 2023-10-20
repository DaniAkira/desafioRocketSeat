import fs from 'fs'
import { parse } from 'csv-parse'
import fetch from 'node-fetch'

export async function processCSV(csvFilePath) {
    const csv = fs.createReadStream(csvFilePath).pipe(parse({delimiter: ','}))
    let isFirstLine = true;

    for await (const task of csv) {
        if(isFirstLine) {
            isFirstLine = false
            continue
        }
        const [title, description] = task

        const taskData = {
            title: title,
            description: description,
        }
        console.log(taskData)

        try {
            const response = await fetch('http://localhost:8080/tasks', {
                method: "POST",
                body: JSON.stringify(taskData),
                headers: { 'content-Type': 'application/json'},
            })

            if(response.status === 201) {
                console.log("task adicionada com sucesso", taskData)
            } else {
                console.log("Erro ao adicionar task", response.status)
            }
        } catch (error) {
            console.error('Erro na requisição', error)
        }
    }
}