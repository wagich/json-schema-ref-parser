function makeNext() {
	return function next(f: () => void) {
		setTimeout(f, 0);
	};
}

export default makeNext();
