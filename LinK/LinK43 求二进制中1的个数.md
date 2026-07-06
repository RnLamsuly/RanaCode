# LinK43 求二进制中1的个数
[题目链接](http://xmuoj.com/contest/362/problem/LinK43)

## lowbit

**lowbit**，即最低非0位对应的数值，是研究[树状数组](https://oi-wiki.org/ds/fenwick/)的一个重要工具。对于树状数组我们不过多展开。

将 `x` 的二进制所有位全部取反，再加 $1$，就可以得到 `-x` 的二进制编码。例如，$6$ 的二进制编码是 `110`，全部取反后得到 `001`，加 $1$ 得到 `010` 。

设原先 `x` 的二进制编码是 `(...)10...00`，全部取反后得到 `[...]01...11`，加 $1$ 后得到 `[...]10...00`，也就是 `-x` 的二进制编码了。这里 `x` 二进制表示中第一个 $1$ 是 `x` 最低位的 $1$。

`(...)` 和 `[...]` 中省略号的每一位分别相反，所以 `x & -x = (...)10...00 & [...]10...00 = 10...00`，得到的结果就是 `lowbit`。

> `lowbit(x) = x & -x`

---

## 思路

每次将 `x` 减去 `lowbit(x)` ，直到减为 $0$，记录做减法的次数即可。

---

## AC代码
```cpp
#include <iostream>
#define lowbit(x) x&-x
using namespace std;

int countBits(int n) {
    int cnt = 0;
    while (n) {
        cnt++;
        n -= lowbit(n);  // 去掉最低位的1
    }
    return cnt;
}

int main() {
    int n;
    cin >> n;
    cout << countBits(n) << endl;
    return 0;
}
```