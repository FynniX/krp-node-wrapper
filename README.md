# krp-node-wrapper

Node.js Wrapper to communicate with [Kart Racing Pro](https://www.kartracing-pro.com/) Server.

With ***krp-node-wrapper*** you have a wrapper which reads the data from the udp livetiming server.

## Requirements

- None

## Installing

This package was tested under [Node.js](https://nodejs.org/) 16.16.0 x64.

[Kart Racing Pro](https://www.kartracing-pro.com/) release13b was used while testing.

`npm install krp-node-wrapper`

## API documentation

## Types

Under src/types/

```
ServerWrapper:
Update Data Types:
EventT
EntryT
EntryRemoveT
SessionT
SessionStatusT
WeatherT
SessionEntryT
DriverStatusT
BestLapT
LastLapT
PenaltyT
LapT
SplitT
SpeedT
ClassificationT
ChallengeDataT
TrackDataT
TrackSegmentT
TrackPositionT
ContactT

ClientWrapper:
Update Data Types:
KartDataT
KartEventT
KartLapT
KartSessionT
KartSplitT
```

# ServerWrapper

## Examples

```js
const wrapper = new KRPNodeWrapper(Hostname, Port, Password, Logging)
```

| Event            | Description                  |
|------------------|------------------------------|
| "connected"      | Shared Memory connected.     |
| "disconnected"   | Shared Memory disconnected.  |
| "update"         | Sends all the received data. |

```js
wrapper.on("update", (type: string, data) => {
    console.log(type, data)
})
```

| Function / Attribute | Description                        |
|----------------------|------------------------------------|
| connected            | Is udp client connected?           |

```js
wrapper.connected
```

# ClientWrapper

## Configuration

proxy_udp.ini

```
[params]
enable = 1
port = 30000
ip = 127.0.0.1:30001
delay = 1
info = 1
```

## Examples

```js
const wrapper = new KRPNodeWrapper(Port, Logging)
```

| Event            | Description                  |
|------------------|------------------------------|
| "update"         | Sends all the received data. |

```js
wrapper.on("update", (type: string, data) => {
    console.log(type, data)
})
```

## License

Released under the [MIT License](https://github.com/FynniX/krp-node-wrapper/blob/main/LICENSE).
