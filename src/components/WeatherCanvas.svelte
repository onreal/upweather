<script lang="ts">
    import {onDestroy, onMount} from 'svelte';

    export let temperature: number = 20;
    export let humidity: number = 50;
    export let windSpeed: number = 10;
    export let windDirection: number = 0;
    export let rainPercentage: number = 0;
    export let snowPercentage: number = 0;
    export let cloudPercentage: number = 0;
    export let locationName: string = '';
    export let latitude: string = '';
    export let longitude: string = '';
    export let backgroundUrl: string = '';

    export let showControls = false;

    let iframeCode: string = '';

    let canvas: HTMLCanvasElement;
    let animationFrameId: number;

    let isDay: boolean = true;
    let sunPosition = { x: 0, y: 0 };
    let moonPosition = { x: 0, y: 0 };
    let clouds = [];
    let raindrops = [];
    let snowflakes = [];
    let boxMargin;

    $: windVector = {
        x: Math.sin((windDirection * Math.PI) / 180) * windSpeed / 10,
        y: -Math.cos((windDirection * Math.PI) / 180) * windSpeed / 10
    };

    function loadSettings() {
        const savedSettings = localStorage.getItem('weatherSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            windSpeed = settings.windSpeed || 0;
            windDirection = settings.windDirection || 0;
            rainPercentage = settings.rainPercentage || 0;
            snowPercentage = settings.snowPercentage || 0;
            cloudPercentage = settings.cloudPercentage || 0;
            temperature = settings.temperature || 20;
            humidity = settings.humidity || 50;
        }
    }

    function saveSettings() {
        const settings = {
            windSpeed,
            windDirection,
            rainPercentage,
            snowPercentage,
            cloudPercentage,
            temperature,
            humidity
        };
        localStorage.setItem('weatherSettings', JSON.stringify(settings));
    }

    function initWeatherParticles() {
        if (!canvas) return;
        for (let i = 0; i < 50; i++) {
            clouds.push({
                x: Math.random() * canvas.width,
                y: Math.random() * (canvas.height * 0.3),
                width: 100 + Math.random() * 150,
                height: 50 + Math.random() * 40,
                layer: Math.floor(Math.random() * 3),
            });
        }

        for (let i = 0; i < 200; i++) {
            raindrops.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                speedY: 5 + Math.random() * 5,
            });
        }

        for (let i = 0; i < 100; i++) {
            snowflakes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                speedY: 1 + Math.random() * 2,
            });
        }
    }

    function updateClouds() {
        for (const cloud of clouds) {
            cloud.x += windVector.x * 1.2 + Math.random() * 0.2;
            cloud.y += Math.sin(cloud.x / 150) * 0.3;

            if (cloud.x > canvas.width) {
                cloud.x = -cloud.width;
            }
        }
    }

    function updateRain() {
        for (const drop of raindrops) {
            drop.x += windVector.x * 5;
            drop.y += drop.speedY;

            if (drop.y > canvas.height || drop.x > canvas.width || drop.x < 0) {
                drop.y = Math.random() * -canvas.height;
                drop.x = Math.random() * canvas.width;
            }
        }
    }

    function updateSnow() {
        for (const snowflake of snowflakes) {
            snowflake.x += windVector.x * 2;
            snowflake.y += snowflake.speedY;

            if (snowflake.y > canvas.height || snowflake.x > canvas.width || snowflake.x < 0) {
                snowflake.y = Math.random() * -canvas.height;
                snowflake.x = Math.random() * canvas.width;
            }
        }
    }

    let lastFrameTime = 0;
    let frameDuration = 70;

    const animateWeather = (timestamp: number) => {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (timestamp - lastFrameTime < frameDuration) {
            requestAnimationFrame(animateWeather);
            return;
        }
        lastFrameTime = timestamp;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (backgroundUrl.trim() !== '') {
            const backgroundImage = new Image();
            backgroundImage.src = backgroundUrl;
            backgroundImage.onload = () => {
                ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
            };
        } else {
            ctx.fillStyle = calculateBackgroundColor();
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        updateDayNightCycle();

        drawClouds(ctx);
        updateClouds();

        drawRain(ctx);
        updateRain();

        drawSnow(ctx);
        updateSnow();

        if (isDay) {
            ctx.fillStyle = 'yellow';
            ctx.arc(sunPosition.x, sunPosition.y, 40, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = 'lightgray';
            ctx.arc(moonPosition.x, moonPosition.y, 30, 0, Math.PI * 2);
            ctx.fill();
        }

        drawLocation(ctx);
        drawTemperature(ctx);
        drawHumidity(ctx);

        requestAnimationFrame(animateWeather);
    };

    function drawLocation(ctx: CanvasRenderingContext2D) {
        let fontSize = Math.min(canvas.width, canvas.height) * 0.1;
        ctx.font = `${fontSize}px Roboto`;
        let textWidth = ctx.measureText(locationName).width;
        let boxHeight = fontSize + 20;
        let padding = Math.min(canvas.width, canvas.height) * 0.02;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(10, 10, textWidth + 4 * padding, boxHeight);
        ctx.fillStyle = 'black';
        ctx.fillText(locationName, 15 + padding, 20 + boxHeight / 2);
    }

    function drawTemperature(ctx: CanvasRenderingContext2D) {
        let fontSize = Math.min(canvas.width, canvas.height) * 0.11;
        ctx.font = `${fontSize}px Roboto`;
        let textWidth = ctx.measureText(temperature.toString() + '°C').width;
        let boxHeight = fontSize + 20;
        let padding = Math.min(canvas.width, canvas.height) * 0.02;
        let boxY = Math.min(canvas.height - boxHeight - 10, fontSize + 30 + boxMargin);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(10, boxY, textWidth + 4 * padding, boxHeight);
        ctx.fillStyle = 'black';
        ctx.fillText(temperature.toString() + '°C', 15 + padding, (boxY - boxHeight) + boxY + boxHeight / 2);
    }

    function drawHumidity(ctx: CanvasRenderingContext2D) {
        let fontSize = Math.min(canvas.width, canvas.height) * 0.11;
        ctx.font = `${fontSize}px Roboto`;
        let textWidth = ctx.measureText(humidity.toString() + ' %').width;
        let boxHeight = fontSize + 20;
        let padding = Math.min(canvas.width, canvas.height) * 0.02;
        let boxY = Math.min(canvas.height - boxHeight, (fontSize * 2) + 50 + (boxMargin * 2));
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(10, boxY, textWidth + 4 * padding, boxHeight);
        ctx.fillStyle = 'black';
        ctx.fillText(humidity.toString() + '%', 15 + padding, (boxHeight / 6) + boxY + boxHeight / 2);
    }

    function drawCloudShape(ctx, width, height) {
        const refWidth = 420;
        const refHeight = 180;

        const scaleX = width / refWidth;
        const scaleY = height / refHeight;

        ctx.beginPath();
        ctx.moveTo(170 * scaleX, 80 * scaleY);
        ctx.bezierCurveTo(130 * scaleX, 100 * scaleY, 130 * scaleX, 150 * scaleY, 230 * scaleX, 150 * scaleY);
        ctx.bezierCurveTo(250 * scaleX, 180 * scaleY, 320 * scaleX, 180 * scaleY, 340 * scaleX, 150 * scaleY);
        ctx.bezierCurveTo(420 * scaleX, 150 * scaleY, 420 * scaleX, 120 * scaleY, 390 * scaleX, 100 * scaleY);
        ctx.bezierCurveTo(430 * scaleX, 40 * scaleY, 370 * scaleX, 30 * scaleY, 340 * scaleX, 50 * scaleY);
        ctx.bezierCurveTo(320 * scaleX, 5 * scaleY, 250 * scaleX, 20 * scaleY, 250 * scaleX, 50 * scaleY);
        ctx.bezierCurveTo(200 * scaleX, 5 * scaleY, 150 * scaleX, 20 * scaleY, 170 * scaleX, 80 * scaleY);
        ctx.closePath();
        ctx.fill();
    }

    function drawClouds(ctx) {
        const cloudCount = Math.floor(cloudPercentage * clouds.length / 100);

        for (let i = 0; i < cloudCount; i++) {
            const cloud = clouds[i];
            ctx.save();
            ctx.translate(cloud.x, cloud.y);

            ctx.globalAlpha = 0.4 + Math.random() * 0.4;

            drawCloudShape(ctx, cloud.width, cloud.height)
            ctx.restore();
        }
        ctx.globalAlpha = 1.0;
    }

    function drawRain(ctx) {
        const rainCount = Math.floor(rainPercentage * raindrops.length / 100);
        ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
        for (let i = 0; i < rainCount; i++) {
            const drop = raindrops[i];
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x + windVector.x * 5, drop.y + drop.speedY);
            ctx.stroke();
        }
    }

    function drawSnow(ctx) {
        const snowCount = Math.floor(snowPercentage * snowflakes.length / 100);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        for (let i = 0; i < snowCount; i++) {
            const snowflake = snowflakes[i];
            ctx.beginPath();
            ctx.arc(snowflake.x, snowflake.y, 3, 0, Math.PI * 2); // Draw each snowflake
            ctx.fill();
        }
    }

    function calculateBackgroundColor() {
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);

        if (isDay) {
            gradient.addColorStop(0, '#87CEEB');  // Sky blue
            gradient.addColorStop(1, '#FFF8E1');  // Soft yellow at horizon
        } else {
            // Nighttime gradient
            gradient.addColorStop(0, '#2C3E50');  // Dark blue sky
            gradient.addColorStop(1, '#34495E');  // Dark near the horizon
        }

        return gradient;
    }

    const updateDayNightCycle = () => {
        const currentTime = new Date();
        const hours = currentTime.getHours();

        // Calculate sun/moon position based on the current hour (e.g., 6 AM to 6 PM for the sun)
        let progress = (hours % 24) / 24;
        let width = canvas.width;
        let height = canvas.height;

        if (hours >= 6 && hours <= 18) {
            isDay = true;
            sunPosition.x = progress * width;
            sunPosition.y = height * 0.2 + Math.sin(progress * Math.PI) * height * 0.3;
        }
        else {
            isDay = false;
            moonPosition.x = progress * width;
            moonPosition.y = height * 0.2 + Math.sin(progress * Math.PI) * height * 0.3;
        }
    };

    function generateIframeCode() {
        iframeCode = `<iframe src="https://weather.coolmule.gr/live?lat=${latitude}&lon=${longitude}&background=${encodeURIComponent(backgroundUrl)}" width="100%" height="auto" style="max-width:600px; height:400px;" frameborder="0"></iframe>`;
    }

    $: {
        generateIframeCode()
        initWeatherParticles();
    }

    function updateCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        boxMargin = Math.min(canvas.width, canvas.height) * 0.01;
        initWeatherParticles();
        requestAnimationFrame(animateWeather);
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initWeatherParticles();
        requestAnimationFrame(animateWeather);
    });

    onMount(() => {
        updateCanvas()
        window.addEventListener('resize', updateCanvas);
        loadSettings();
        initWeatherParticles();
        requestAnimationFrame(animateWeather);
    });

    onDestroy(() => {
        cancelAnimationFrame(animationFrameId);
    });
</script>

<canvas bind:this={canvas}></canvas>
{#if showControls}
<div class="controls">
    <label for="windSpeed">Wind Speed: {windSpeed}</label>
    <input type="range" id="windSpeed" min="0" max="100" step="1" bind:value={windSpeed} on:change={saveSettings} />

    <label for="windDirection">Wind Direction: {windDirection}</label>
    <input type="range" id="windDirection" min="0" max="360" step="1" bind:value={windDirection} on:change={saveSettings} />

    <label for="rainPercentage">Rain Percentage: {rainPercentage}</label>
    <input type="range" id="rainPercentage" min="0" max="100" step="1" bind:value={rainPercentage} on:change={saveSettings} />

    <label for="snowPercentage">Snow Percentage: {snowPercentage}</label>
    <input type="range" id="snowPercentage" min="0" max="100" step="1" bind:value={snowPercentage} on:change={saveSettings} />

    <label for="cloudPercentage">Cloud Percentage: {cloudPercentage}</label>
    <input type="range" id="cloudPercentage" min="0" max="100" step="1" bind:value={cloudPercentage} on:change={saveSettings} />
</div>
<div class="embed-controls">
    <label for="latitude">Latitude: </label>
    <input type="text" id="latitude" bind:value={latitude} />

    <label for="longitude">Longitude: </label>
    <input type="text" id="longitude" bind:value={longitude} />

    <label for="backgroundUrl">Background URL: </label>
    <input type="text" id="backgroundUrl" bind:value={backgroundUrl} />

    <label for="embedCode">Embed Code:</label>
    <textarea id="embedCode" readonly>{iframeCode}</textarea>
</div>
<button on:click={() => isDay = !isDay}>
    Toggle Day/Night
</button>
{/if}

<style lang="scss" global>
  @import '../assets/styles';
</style>
