export type WeatherT = {
  condition: WeatherConditionT;
  temperature: WeatherTemperatureT;
}

type WeatherTemperatureT = {
  air: number;
  track: number;
}

export type WeatherConditionT = "CLEAR" | "CLOUDY" | "RAINY";