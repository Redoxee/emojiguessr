"use strict";
function CreateExplosion(target, parameters) {
    const root = document.createElement('div');
    root.className = 'explosion';
    const sparkContents = (parameters === null || parameters === void 0 ? void 0 : parameters.SparkContent) || ['🏅', '🏆', '🎉', '🔥'];
    const numberOfSpark = (parameters === null || parameters === void 0 ? void 0 : parameters.NumberOfSpark) || 30;
    const duration = (parameters === null || parameters === void 0 ? void 0 : parameters.Duration) || 7;
    const possibleSparkDelay = (parameters === null || parameters === void 0 ? void 0 : parameters.DelayVariance) || .3;
    const durationVariance = (parameters === null || parameters === void 0 ? void 0 : parameters.DurationVariance) || .9;
    const splosionWidht = (parameters === null || parameters === void 0 ? void 0 : parameters.Width) || 10;
    const splosionWidhtVariance = (parameters === null || parameters === void 0 ? void 0 : parameters.WidthVariance) || .9;
    for (let index = 0; index < numberOfSpark; ++index) {
        let sparkParent = document.createElement('div');
        sparkParent.className = 'spark-parent';
        const angle = Math.random() * Math.PI * 2;
        const contentAngle = Math.random() * Math.PI * 2;
        const parentWidth = (Math.random() * splosionWidhtVariance + 1 - splosionWidhtVariance) * splosionWidht;
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
    setTimeout(() => {
        root.remove();
    }, (duration) * 1000);
}
