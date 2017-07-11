
## Installation

```sh
    npm i
```

## Run Async-multi-process test
```sh
    npm run ok
```

## Run Sync-multi-process erroneous test
```sh
    npm run no
```

## Settings

 - If you wish to rename endpoint, edit `settings.json`.
```json
{
    "url": "https://reqres.in/api/unknown/2", // The URL you want to consume           
    "method": "GET",                          // The method to use on that call        
    "body": "",                               // Wether to send body or not            
    "blocking":false,                         // Wether to block the main process      
    "interval":1000                           //    while waiting for the next interval
                                              //    (valid only on 'test-NO')          
}

```

