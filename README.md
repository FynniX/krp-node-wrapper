# krp-node-wrapper

Node.js Wrapper to communicate with [Kart Racing Pro](https://www.kartracing-pro.com/) Server.

With ***krp-node-wrapper*** you have a wrapper which reads the data from the udp livetiming server.

## Requirements

- None

## Installing

This package was tested under [Node.js](https://nodejs.org/) 16.16.0 x64.

[Kart Racing Pro](https://www.kartracing-pro.com/) release13b was used while testing.

`npm install https://github.com/FynniX/krp-node-wrapper.git --save`
or
`npm install git@github.com:FynniX/krp-node-wrapper.git --save`

## API documentation

# Shared Memory

```js
const wrapper = new KRPNodeWrapper(Hostname, Port, Password, Logging)
```

| Event            | Description                  |
|------------------|------------------------------|
| "connected"      | Shared Memory connected.     |
| "disconnected"   | Shared Memory disconnected.  |
| "update"         | Sends all the received data. |

```js
wrapper.on("update", result => {
    console.log(result)
})
```

| Function / Attribute | Description                        |
|----------------------|------------------------------------|
| connected            | Is udp client connected?           |

```js
wrapper.connected
```

## License

Released under the [MIT License](https://github.com/FynniX/krp-node-wrapper/blob/main/LICENSE).
