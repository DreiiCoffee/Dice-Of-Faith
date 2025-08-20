const rollBtn = document.getElementById('rollBtn');
const diceValuesEl = document.getElementById('diceValues');
const fateTextEl = document.getElementById('fateText');
const cursedOverlay = document.getElementById('cursedOverlay');

const diceEls = [
	document.getElementById('dice1'),
	document.getElementById('dice2'),
	document.getElementById('dice3'),
];

const FATE_MESSAGES = {
	1: 'You will trip gracefully over nothing and style it out.',
	2: 'A snack you forgot exists will appear in a pocket.',
	3: 'You will remember a password on the first try. Astonishing.',
	4: 'Someone will laugh at your joke. On purpose.',
	5: 'You will find a song that loops in your head but you won’t mind.',
	6: 'Your coffee will be exactly the right temperature.',
};

function rotationForValue(v) {
	switch (v) {
		case 1: return 'rotateX(0deg) rotateY(0deg)';
		case 2: return 'rotateX(-90deg) rotateY(0deg)';
		case 3: return 'rotateX(0deg) rotateY(-90deg)';
		case 4: return 'rotateX(0deg) rotateY(90deg)';
		case 5: return 'rotateX(90deg) rotateY(0deg)';
		case 6: return 'rotateX(0deg) rotateY(180deg)';
		default: return 'rotateX(0deg) rotateY(0deg)';
	}
}

function rollOnce() { return 1 + Math.floor(Math.random() * 6); }

function fateFor(values) {
	if (values.join('') === '666') return 'CURSED: The air chills as eyes open in the dark.';
	return FATE_MESSAGES[values[2]] || 'Your path is unclear. Try again.';
}

function showCursedFlash() {
	cursedOverlay.style.display = 'flex';
	setTimeout(() => { cursedOverlay.style.display = 'none'; }, 2000);
}

let isLocked = false;
let audioCtx;
function playRollSound() {
	try {
		if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		const now = audioCtx.currentTime;
		const gain = audioCtx.createGain();
		gain.gain.setValueAtTime(0.0, now);
		gain.gain.linearRampToValueAtTime(0.35, now + 0.02);
		gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
		gain.connect(audioCtx.destination);

		const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.35, audioCtx.sampleRate);
		const data = buffer.getChannelData(0);
		for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
		const noise = audioCtx.createBufferSource();
		noise.buffer = buffer;
		const filter = audioCtx.createBiquadFilter();
		filter.type = 'bandpass';
		filter.frequency.setValueAtTime(900, now);
		filter.Q.value = 0.6;
		noise.connect(filter);
		filter.connect(gain);
		noise.start(now);

		const osc = audioCtx.createOscillator();
		osc.type = 'triangle';
		osc.frequency.setValueAtTime(220, now);
		const og = audioCtx.createGain();
		og.gain.setValueAtTime(0.25, now);
		og.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
		osc.connect(og);
		og.connect(audioCtx.destination);
		osc.start(now);
		osc.stop(now + 0.2);
	} catch {}
}

function rollDice() {
	if (isLocked) return;
	isLocked = true;
	rollBtn.disabled = true;
	playRollSound();
	const values = [rollOnce(), rollOnce(), rollOnce()];
	values.forEach((v, i) => {
		const el = diceEls[i];
		el.classList.add('rolling');
		el.style.transform = rotationForValue(v) + ' translateZ(0)';
		setTimeout(() => el.classList.remove('rolling'), 650);
	});
	diceValuesEl.textContent = `Rolls: ${values.join(' - ')}`;
	fateTextEl.textContent = fateFor(values);
	if (values.join('') === '666') showCursedFlash();
	setTimeout(() => { isLocked = false; rollBtn.disabled = false; }, 1000);
}

rollBtn.addEventListener('click', rollDice);
window.addEventListener('keydown', (e) => { if (e.code === 'Space') rollDice(); });

