# LinK44 二进制中1的最低位位置(打表+Lowbit)
[题目链接](http://xmuoj.com/contest/362/problem/LinK44)

## AC代码
```cpp
#include <iostream>
using namespace std;

// 打表：2^i 对应的最低位1的位置
int log2Table[65536];  // 2^16 = 65536

void init() { //可以将数值硬编码到数组中
    for (int i = 0; i < 16; i++) {
        log2Table[1 << i] = i;
    }
}

int main() {
    init();
    
    int n;
    cin >> n;
    
    // 提取最低位的1
    int lowbit = n & -n;
    
    // 查表得到位置
    cout << log2Table[lowbit] << endl;
    
    return 0;
}
```