interface ExplosionParameters {
	SparkContent : string[],
	Duration : number,
	NumberOfSpark : number,
	Width : number,
	DurationVariance : number,
	WidthVariance : number,
	DelayVariance : number,
}

function CreateSparkExplosion(target : HTMLElement, parameters : ExplosionParameters|null) : void {
	const root = document.createElement('div');
	root.className = 'explosion';

	const sparkContents = parameters?.SparkContent || ['🏅','🏆','🎉','🔥'];
	const numberOfSpark = parameters?.NumberOfSpark || 30;
	const duration = parameters?.Duration || 7;
	const possibleSparkDelay = parameters?.DelayVariance || .3;
	const durationVariance = parameters?.DurationVariance || .9;
	const splosionWidht = parameters?.Width || 10;
	const splosionWidhtVariance = parameters?.WidthVariance || .9;

	for (let index = 0; index < numberOfSpark; ++index ){
		let sparkParent = document.createElement('div');
		sparkParent.className = 'spark-parent';

		const angle = Math.random() * Math.PI * 2;
		const contentAngle = Math.random() * Math.PI * 2;
		const parentWidth = (Math.random()  * splosionWidhtVariance + 1 - splosionWidhtVariance) * splosionWidht;
		const contentIndex = Math.floor(Math.random() * sparkContents.length);
		const delay = Math.random() * possibleSparkDelay;
		const sparkDuration = (Math.random() * durationVariance + 1 - durationVariance) * (duration - delay);

		sparkParent.style.transform = `translate(-50%, 0%) rotate(${angle}rad) translate(50%, 0%)`;
		sparkParent.style.width = `${parentWidth}em`;
		sparkParent.style.animationDuration = `${sparkDuration}s`;
		sparkParent.style.animationDelay = `${delay}s`;

		let spark = document.createElement('div');
		spark.className = 'spark';
		spark.textContent = sparkContents[contentIndex];
		spark.style.animationDuration = `${sparkDuration}s`;
		spark.style.animationDelay = `${delay}s`;
		spark.style.transform = `${contentAngle}rad`;

		// console.log(`duration ${sparkDuration}sec, width ${parentWidth} em`);
		root.appendChild(sparkParent);
		sparkParent.appendChild(spark);
	}

	target.appendChild(root);

	setTimeout(()=>{
		root.remove();
	}, (duration) * 1000);
}