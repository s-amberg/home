import { HttpClient } from "./lib/dal/http";
import { TodoDAO } from "./todo/dal/todo-dao";

export class DIContainer {

    private static instance: DIContainer;

    public static httpClient: HttpClient =  new HttpClient();

    constructor(
        public todoDAO: TodoDAO,
        
    ) {

    }

    private static make(): DIContainer {



        return new DIContainer(
            new TodoDAO(this.httpClient)
        );
    }

    static get getDiContainer(): DIContainer {
        return this.instance ?? this.make();
    }
}