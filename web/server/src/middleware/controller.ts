import { Express, Request, Response } from "express";
import bodyParser from "body-parser";

type BodyParser = typeof Controller.jsonParser

export abstract class Controller<T, DTO> {

    static jsonParser = bodyParser.json({limit: '1mb'})
    static urlEncodedParser: BodyParser = bodyParser.urlencoded({ extended: false })
    
    
    constructor(app: Express) {
        this.routes(app)
    }


    protected abstract routes(app: Express): void;

    protected abstract fromDTO(data: DTO): T;
    protected abstract toDTO(data: T): DTO;

    protected post(app: Express, path: string, bodyParser: BodyParser): (call: (body: T, request: Request) => Promise<T>) => Express {

        return (call: (body: T, request: Request) => Promise<T>) => app.post(path, bodyParser, async (req: Request, res: Response) => {

            const body: T = this.fromDTO(req.body)
            const responseJSON: T = await call(body, req)
            res.status(200)
            res.json(this.toDTO(responseJSON))
        })
    }

    protected get(app: Express, path: string): (call: (request: Request) => Promise<T>) => Express {

        return (call: (request: Request) => Promise<T>) => app.get(path, async (req: Request, res: Response) => {

            const responseJSON: T = await call(req)
            res.status(200)
            res.json(this.toDTO(responseJSON))
        })
    }
}