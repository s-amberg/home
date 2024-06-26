import  { Client } from 'pg';





export const pgConnect = async () => {
    const port = parseInt(process.env.POSTGRES_PORT ?? "5432");
    const host = process.env.POSTGRES_HOST 
    
    const client = new Client({
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PW,
        host: host,
        port: port,
        database: 'todo',
    });
    await client.connect()
}