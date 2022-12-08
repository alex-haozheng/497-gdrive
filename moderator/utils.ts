export function stringDistance(s: string, t: string): number {
	const m: number = s.length,
		n: number = t.length;
	if (n * m === 0) return m + n;
	const dp: number[][] = new Array(m + 1).fill(null).map(() => new Array(n + 1).fill(0));
	for (let i = 0; i <= m; ++i) {
		dp[i][0] = i;
	}
	for (let j = 0; j <= n; ++j) {
		dp[0][j] = j;
	}
	for (let i = 1; i <= m; ++i) {
		for (let j = 1; j <= n; ++j) {
			if (s[i - 1] === t[j - 1]) {
				dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1] - 1);
			} else {
				dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
			}
		}
	}
	return dp[m][n];
}