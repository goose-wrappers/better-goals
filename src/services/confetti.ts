class ConfettiParticle {

	private possibleColors = [
		"DodgerBlue",
		"OliveDrab",
		"Gold",
		"Pink",
		"SlateBlue",
		"LightBlue",
		"Gold",
		"Violet",
		"PaleGreen",
		"SteelBlue",
		"SandyBrown",
		"Chocolate",
		"Crimson"
	];

	private x: number;
	private y: number;
	private readonly r: number;
	private readonly d: number;
	private readonly color: string;
	private tilt: number;
	private readonly tiltAngleIncremental: number;
	private tiltAngle: number;

	constructor(private W: number, private H: number, maxConfettis: number) {
		this.x = Math.random() * W; // x
		this.y = Math.random() * H - H; // y
		this.r = this.randomFromTo(11, 33); // radius
		this.d = Math.random() * maxConfettis + 11;
		this.color = this.possibleColors[Math.floor(Math.random() * this.possibleColors.length)];
		this.tilt = Math.floor(Math.random() * 33) - 11;
		this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
		this.tiltAngle = 0;
	}

	private randomFromTo(from: number, to: number): number {
		return Math.floor(Math.random() * (to - from + 1) + from);
	}

	public draw(context: CanvasRenderingContext2D): void {
		context.beginPath();
		context.lineWidth = this.r / 2;
		context.strokeStyle = this.color;
		context.moveTo(this.x + this.tilt + this.r / 3, this.y);
		context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
		return context.stroke();
	}

	public isVisible(): boolean {
		return (this.y < this.H);
	}

	public animate(): void {
		const i = 75;

		this.tiltAngle += this.tiltAngleIncremental;
		this.y += (Math.cos(this.d) + 3 + this.r / 2) / 2 / 2; // 100% slow-down
		this.tilt = Math.sin(this.tiltAngle - i / 3) * 15;
	}
}

export class Confetti {

	private context: CanvasRenderingContext2D|null;

	private particles: ConfettiParticle[] = [];

	constructor(private canvas: HTMLCanvasElement) {
		this.context = canvas.getContext("2d");
	}

	public run(maxConfettis: number) {

		const W = this.canvas.clientWidth;
		const H = this.canvas.clientHeight;

		for (let i = 0; i < maxConfettis; i++) {
			this.particles.push(new ConfettiParticle(W, H, maxConfettis));
		}

		// draw first frame, requestAnimationFrame will take it from there
		this.draw();
	}

	private draw(): void {
		const W = this.canvas.clientWidth;
		const H = this.canvas.clientHeight;
		this.context?.clearRect(0, 0, W, H);

		let repeat = false;

		for (let i = 0; i < this.particles.length; i++) {
			this.particles[i].draw(this.context!);
			this.particles[i].animate();

			repeat = repeat || this.particles[i].isVisible();
		}

		if (repeat) {
			// loop another animation frame
			window.requestAnimationFrame(() => this.draw());
		} else {
			// so elements underneath will receive clicks
			this.canvas?.parentNode?.removeChild(this.canvas);
			// for (let i=0; i<this.particles.length; i++) {
			// 	this.particles[i] = new ConfettiParticle(W, H, 250);
			// }
			// window.requestAnimationFrame(() => this.draw());
		}
	}
}
