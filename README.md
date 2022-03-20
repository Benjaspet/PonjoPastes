# PonjoPastes
A pastebin alternative by Ponjo Studios. Easily share text and code without hassle. You can view the live deployment of this project [here](https://pastes.ponjo.club).

### Contributing

We are welcoming open-source contributors. If you'd like to make a pull request or suggestion, don't hesitate to make an issue on this repository.

### API Documentation

#### /api/v1/fetch/:id

- Fetch a paste by ID.
- Request method: `GET`

| **Parameter** | **Type** | **Details** | **Required** |
| :---: | :---: | :---: | :---: |
| `id` | `string` | The ID of the paste to fetch. | `true` |
| **Header** | **Type** | **Description** | **Required** |
| Connection | `string` | `keep-alive` | `false` |

#### Sample Response

🟢 **Status: 200** ─ Success.
```json
{
  "message": "Success.",
  "paste": {
    "content": "An apple a day keeps the doctor away.",
    "id": "mvDZ1RZJG",
    "url": "https://pastes.ponjo.club/mvDZ1RZJG",
    "contentLength": 37
  }
}
```

#### /api/v1/create

- Create a paste.
- Request method: `PUT`
- This method requires a request body.

| **Body Type** | **Details** | **Required** |
| :---: | :---: | :---: |
| `text/plain` | The content of your paste. | `true` |
| **Header** | **Type** | **Required** |
| Content-Type | `text/plain` | `true` |

#### Sample Response

🟢 **Status: 200** ─ Success.
```json
{
  "message": "Success.",
  "paste": {
    "content": "An apple a day keeps the doctor away.",
    "id": "mvDZ1RZJG",
    "url": "https://pastes.ponjo.club/mvDZ1RZJG",
    "contentLength": 37
  }
}
```

#### Example API Usage

- TypeScript:

```ts
import * as axios from "axios";
import {AxiosRequestConfig} from "axios";

const requestConfig: AxiosRequestConfig = {
    url: "https://pastes.ponjo.club/api/v1/create",
    method: "PUT",
    data: "Hello world!"
};

await axios.put(requestConfig)
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.log(error);
    });
```

### License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

Copyright © 2022-Present Ben Petrillo

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
