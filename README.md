# mock-axios
Axios Mocking from https://gist.github.com/cowboy/44ae5deed5d04d2cf28f2087fde2c89c

# Usage

```
import axios from 'axios'
import  {addMock, enableMocking} from './mock-axios'

addMock('https://dog.ceo/api/breeds/list/all', {data: {mock: 'dogs'}})
addMock('https://dog.ceo/404-page', {status: 404, message: 'whoops'})

enableMocking(true)

// mocked
let result = await axios.get('https://dog.ceo/api/breeds/list/all')
console.log(1, result)
try {
  result = await axios.get('https://dog.ceo/404-page')
} catch (err) {
  console.log(2, err)
}

// not mocked
result = await axios.get('https://dog.ceo/api/breeds/list/all?foo=1')
console.log(3, result)
try {
  result = await axios.get('https://dog.ceo/unhandled-404')
} catch (err) {
  console.log(4, err)
}
```
