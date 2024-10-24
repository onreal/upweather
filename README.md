# Modular Weather Visualization

A dynamic weather visualization canvas built with Svelte and TypeScript. This project simulates various weather conditions such as clouds, rain, snow, and wind, along with a day/night cycle. The visual effects are driven by real-time weather data, allowing for a visually impressive, interactive experience. The visualization is modular and can be embedded in any website as an iframe, where users can pass custom parameters for location and background images.

## Features

- Weather Conditions: Visualize clouds, rain, snow, and wind effects, all dynamically generated on a canvas.
- Day/Night Cycle: Realistic transitions between day and night with a moving sun and moon.
- Wind Effects: Clouds and snowflakes move in response to wind speed and direction.
- Customizable Embeds: The weather visualization can be embedded into other websites using an iframe. Users can provide custom parameters like latitude, longitude, and a background image URL.
- Weather API Integration: The app fetches real-time weather data using a Weather Forecast API and displays it on the canvas.
- Responsive & Modular: Easily extend the system by adding new weather effects or customizing the current ones.

## Getting Started

### Prerequisites

To run this project locally, you'll need:

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:

   git clone https://github.com/yourusername/weather-visualization.git
   cd weather-visualization

2. Install dependencies:

   npm install

3. Set up environment variables by creating a .env file in the root directory. Add your API key for the weather forecast service:

   VITE_WEATHER_API_KEY=your_api_key_here

4. Run the development server:

   npm run dev

   The application will be available at http://localhost:3000.

### Usage

1. Open the project in your browser at http://localhost:3000.
2. The weather visualization will automatically update based on real-time weather data for the default location.
3. To embed the weather visualization on your own website, use the following iframe:

   <iframe
   src="https://your-weather-visualization.com/embed?lat=40.7128&lon=-74.0060&bg=https://example.com/background.jpg"
   width="800"
   height="600"
   frameborder="0"
   ></iframe>

   Replace lat, lon, and bg with the desired latitude, longitude, and background image URL.

### Deployment

To build the app for production:

npm run build

The output files will be located in the dist/ directory, ready to be served by a static file server.

### Roadmap

- Add weather forecast for multiple days.
- Implement more weather conditions (e.g., thunderstorms, fog).
- Add location search functionality.
- Improve performance for large numbers of moving elements.

### Contributing

We welcome contributions! Feel free to submit issues or pull requests.

### License

This project is licensed under the MIT License. See the LICENSE file for details.

### Acknowledgements

- Svelte for providing the UI framework.
- OpenWeatherMap for the weather data API.
- MDN Web Docs for extensive documentation on the Canvas API.
