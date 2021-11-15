import { yellow } from 'kleur/colors';
export function trackElapsedTime() {
    var time = process.hrtime();
    return function () {
        var elapsedTime = process.hrtime(time);
        var duration = elapsedTime[0] + elapsedTime[1] / 1e9;
        return yellow(duration.toFixed(3) + "s");
    };
}
