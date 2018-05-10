const jsonfile = require('jsonfile');
const graphFile = 'graph-data.json';

function smartGraphRandom() {
	const firstRandom = () => Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
	const nextRandom = () => Math.floor((Math.random() - 0.5) * 2 * (300 - 100 + 1)) + 100;
	const firstDate = new Date(2017, 01, 31);
	console.log(firstDate);

	function toPush(lastElem, i) {
		const elem = {};
		const lastElemDate = new Date(JSON.parse(lastElem.date));

		const next = nextRandom();

		elem.date = JSON.stringify(new Date(lastElemDate.setMonth(lastElemDate.getMonth() + 1)));
		elem.value = (lastElem.value + next >= 0 ? lastElem.value + next : lastElem.value - next);

		console.log(elem);

		return elem;
	}

	const first = firstRandom();
	const second = firstRandom();
	const third = first - second;

	ans = [
		[
			{date: JSON.stringify(firstDate), value: first}
		],
		[
			{date: JSON.stringify(firstDate), value: second}
		],
		[
			{date: JSON.stringify(firstDate), value: third}
		]
	];

	for(let i = 1; i < 15; i++) {
		ans[0].push(toPush(ans[0][i - 1], i));
		ans[1].push(toPush(ans[1][i - 1], i));

		ans[2].push({
			date: ans[0][i].date,
			value: ans[0][i].value - ans[1][i].value
		});

		console.log(ans[2][i]);
	}

	return ans;
}

(function v() {
	const ans = smartGraphRandom();
	jsonfile.writeFileSync(graphFile, ans);
})();