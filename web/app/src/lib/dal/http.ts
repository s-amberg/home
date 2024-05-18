export class HttpClient {

    host = process.env.NODE_ENV === 'development' ? `http://localhost` : `https://localhost`
    port = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_SERVER_PORT : ''
    baseUrl: string = `${this.host}:${this.port}/api`;

    checkStatus(response: Response): Promise<any> {
      return new Promise((resolve, reject) => {
        try{
          if (response.status >= 200 && response.status < 300) {
            resolve(this.parseJSON(response));
          } else {
            const error: Error & {response: Response} = {
              ...new Error(response.statusText),
              response: response
            };
            reject(error);
          }
        } catch(e){
          reject(e)
        }
      })
    }

    parseJSON(response: Response) {
        return response.json();
    }
      
    get(endpoint: string) {
        return this.getAuthenticatedJson(endpoint, "token")
    }
    async getAuthenticatedJson(endpoint: string, token: string) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        })
        return this.checkStatus(response);
    }
    
    post(endpoint: string, params: object) {
        return fetch(`${this.baseUrl}${endpoint}`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            },
            body: JSON.stringify(params),
        }).then((e) => this.checkStatus(e));
    }
      
    postAuthenticatedJson(endpoint: string, token: string, params: object) {
        return fetch(`${this.baseUrl}${endpoint}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(params),
        }).then((e) => this.checkStatus(e));
    }
}