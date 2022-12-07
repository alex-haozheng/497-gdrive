"use strict";
exports.__esModule = true;
function stringDistance(s, t) {
    var m = s.length, n = t.length;
    if (n * m === 0)
        return m + n;
    var dp = new Array(m + 1).fill(null).map(function () { return new Array(n + 1).fill(0); });
    for (var i = 0; i <= m; ++i) {
        dp[i][0] = i;
    }
    for (var j = 0; j <= n; ++j) {
        dp[0][j] = j;
    }
    for (var i = 1; i <= m; ++i) {
        for (var j = 1; j <= n; ++j) {
            if (s[i - 1] === t[j - 1]) {
                dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1] - 1);
            }
            else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
        }
    }
    return dp[m][n];
}
exports["default"] = stringDistance;
;
