import  { Pool, PoolConfig } from 'pg';

export class DB {
    
    pool: Pool;

    constructor() {
        this.pool = new Pool(this.getConfig())
    }

    getConfig = (): PoolConfig => {
        const port = parseInt(process.env.POSTGRES_PORT ?? "5432");
        const host = process.env.POSTGRES_HOST 
        
        return {
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PW,
            host: host,
            port: port,
            database: 'todo',
        };
    }

    pgConnect = async () => {
        await this.pool.connect()
    }

    query = (text: string, params: any) => this.pool.query(text, params)    

}