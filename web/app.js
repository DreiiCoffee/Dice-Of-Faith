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
	1: [
		'A small win will snowball into momentum.',
		'You will find a coin you swear wasn’t there.',
		'A stranger will hold the door at the perfect time.',
		'Your playlist will queue the exact song you needed.',
		'The Wi‑Fi will just work. First try.',
		'A delayed plan will become a better plan.',
		'You’ll laugh at a meme you almost scrolled past.',
		'Your coffee or tea will taste unexpectedly elite.',
	],
	2: [
		'Send that message; it’ll land better than you expect.',
		'A shortcut you discover will save you ten minutes.',
		'Today favors bold but tidy risks.',
		'You’ll remember an old idea worth reviving.',
		'A friend pings you right when you were thinking of them.',
		'Choose the comfy shoes. Future you approves.',
		'Luck hides in a boring task—check again.',
		'Your timing will be weirdly perfect.',
	],
	3: [
		'Focus beats force; finish the small thing first.',
		'An answer arrives in the shower (or equivalent).',
		'Your joke ratio goes up 27%.',
		'Start now; momentum will meet you halfway.',
		'You’ll find your missing item in a “safe place.”',
		'The tab you need is already open.',
		'The right tutorial appears on page one.',
		'You’ll dodge a small annoyance like a pro.',
	],
	4: [
		'Collaboration beats solo grind today.',
		'Ask the simple question; it unlocks the hard one.',
		'Someone shares a resource that just fits.',
		'Take a break; that’s when the solution shows up.',
		'Organize once; thank yourself twice.',
		'A glitch resolves itself after you look away.',
		'A kind comment finds you.',
		'You’ll land the clean refactor—in code or life.',
	],
	5: [
		'Patience cashes out—wait one beat longer.',
		'A tiny habit sticks today.',
		'The thing you feared is actually manageable.',
		'You’ll sleep well after this.',
		'You’ll delete something you don’t need and feel lighter.',
		'A free upgrade (or extra fries) appears.',
		'Your luck improves after a short walk.',
		'You’ll say “no” once and it feels great.',
	],
	6: [
		'Jackpot vibes: a crisp yes arrives soon.',
		'You find unexpected energy at the right hour.',
		'An easy mode unlocks after a hard mode week.',
		'Your hunch is correct; trust it.',
		'You’ll catch a beautiful coincidence.',
		'The next tab is exactly the one you need.',
		'Someone admires your vibe silently.',
		'Plan A works like Plan C: surprisingly well.',
	],
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
	const pool = FATE_MESSAGES[values[2]];
	if (Array.isArray(pool) && pool.length) return pool[Math.floor(Math.random() * pool.length)];
	return 'Your path is unclear. Try again.';
}

function showCursedFlash() {
	cursedOverlay.style.display = 'flex';
	setTimeout(() => { cursedOverlay.style.display = 'none'; }, 5000);
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

function playEerieSound() {
	try {
		if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		const now = audioCtx.currentTime;
		const master = audioCtx.createGain();
		master.gain.setValueAtTime(0.0, now);
		master.gain.linearRampToValueAtTime(0.35, now + 0.2);
		master.gain.exponentialRampToValueAtTime(0.0001, now + 4.8);
		master.connect(audioCtx.destination);

		const lowpass = audioCtx.createBiquadFilter();
		lowpass.type = 'lowpass';
		lowpass.frequency.setValueAtTime(1200, now);
		lowpass.Q.value = 0.7;
		lowpass.connect(master);

		const osc1 = audioCtx.createOscillator();
		osc1.type = 'sine';
		osc1.frequency.setValueAtTime(110, now);
		const osc2 = audioCtx.createOscillator();
		osc2.type = 'sine';
		osc2.frequency.setValueAtTime(116, now);
		const oGain = audioCtx.createGain();
		oGain.gain.setValueAtTime(0.2, now);
		osc1.connect(oGain);
		osc2.connect(oGain);
		oGain.connect(lowpass);
		osc1.start(now);
		osc2.start(now);
		osc1.stop(now + 5);
		osc2.stop(now + 5);

		const noiseBuf = audioCtx.createBuffer(1, audioCtx.sampleRate * 5, audioCtx.sampleRate);
		const ch = noiseBuf.getChannelData(0);
		for (let i = 0; i < ch.length; i++) {
			const t = i / ch.length;
			ch[i] = (Math.random() * 2 - 1) * 0.1 * (1 - t);
		}
		const noise = audioCtx.createBufferSource();
		noise.buffer = noiseBuf;
		const nGain = audioCtx.createGain();
		nGain.gain.value = 0.12;
		noise.connect(nGain);
		nGain.connect(lowpass);
		noise.start(now);
		noise.stop(now + 5);
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
	if (values.join('') === '666') { showCursedFlash(); playEerieSound(); }
	setTimeout(() => { isLocked = false; rollBtn.disabled = false; }, 1000);
}

rollBtn.addEventListener('click', rollDice);
window.addEventListener('keydown', (e) => { if (e.code === 'Space') rollDice(); });

