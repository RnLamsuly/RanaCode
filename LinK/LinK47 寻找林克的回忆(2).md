# LinK47 寻找林克的回忆(2)
[题目链接](http://xmuoj.com/contest/362/problem/LinK47)

这是 [LinK46](http://xmuoj.com/contest/362/problem/LinK46) 的多组数据版本，要求我们优化效率。


## 思路

从两方面优化：

1. 启发式搜索：每次枚举的时候选择可选数字最少的格子。这样我们可以尽量减少搜索的分支，优化效率。

2. 位运算优化：不再使用数组记录数字使用情况，改为使用二进制掩码存储。位运算提高统计数字的效率。


---

## 实现细节

- 宫格本来使用 `bool[3][3][9]` 记录，前两个索引代表宫格的位置。改为使用掩码之后，需要用一维的九个位来表示3*3的位置。不妨记 `digit = x*3 + y` ， 可以理解为一种**状态压缩**。

- 获取可用数字时，我们通过**按位或 + 子掩码**来求出可用数字的掩码：
`validMask = ~(rowMask[x] | colMask[y] | boxMask[(x/3)*3 + y/3]) & 0x1FF`

- 计数可选数字个数的时候，直接对掩码进行位操作。

---

## AC代码
```cpp
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;
 
int A[9][9];
bool originMark[9][9];
int rowMask[9], colMask[9], boxMask[9];
 
int getCandidates(int x, int y) { // 获取可用数字的掩码
    return ~(rowMask[x] | colMask[y] | boxMask[(x/3)*3 + y/3]) & 0x1FF;
}
 
int countBits(int mask) { // 获取可选数字个数
    int count = 0;
    while(mask) {
        count++;
        mask &= (mask - 1);
    }
    return count;
}
 
void initialize() // 初始化
{
    for(int i = 0; i < 9; ++i) {
        for(int j = 0; j < 9; ++j) {
            A[i][j] = 0;
            originMark[i][j] = false;
        }
        rowMask[i] = 0;
        colMask[i] = 0;
        boxMask[i] = 0;
    }
}
 
bool input() // 读入，相较于上一题格式上有变化
{
    string line;
    cin >> line;
    if(line == "end") return false;
    if(line.length() != 81) return false;
    
    for(int i = 0; i < 9; ++i) {
        for(int j = 0; j < 9; ++j) {
            int index = i * 9 + j;
            if(line[index] != '.') {
                int num = line[index] - '0';
                A[i][j] = num;
                originMark[i][j] = true;
                int bit = 1 << (num - 1);
                rowMask[i] |= bit;
                colMask[j] |= bit;
                boxMask[(i/3)*3 + j/3] |= bit;
            }
        }
    }
    return true;
}
 
void output() //输出
{
    for(int i = 0; i < 9; ++i) {
        for(int j = 0; j < 9; ++j) {
            cout << A[i][j];
        }
    }
    cout << endl;
}
 
bool dfs()
{
    int minX = -1, minY = -1, minCandidates = 10; // 分别记录可选数字最少的格子的坐标和可选数字个数
    int candidates = 0;
    
	// 枚举查找下一个可选数字最少的格子
    for(int i = 0; i < 9; ++i) {
        for(int j = 0; j < 9; ++j) {
            if(!originMark[i][j] && A[i][j] == 0) {
                int cand = getCandidates(i, j);
                int count = countBits(cand);
                if(count == 0) return false;
                if(count < minCandidates) {
                    minCandidates = count;
                    minX = i;
                    minY = j;
                    candidates = cand;
                    if(count == 1) break;
                }
            }
        }
        if(minCandidates == 1) break;
    }
    
    if(minX == -1) { //没有可填的数字了，直接结束
        output();
        return true;
    }
    
    for(int num = 1; num <= 9; ++num) { // 进行枚举与回溯
        int bit = 1 << (num - 1);
        if(candidates & bit) {
            A[minX][minY] = num;
            originMark[minX][minY] = true;
            rowMask[minX] |= bit;
            colMask[minY] |= bit;
            boxMask[(minX/3)*3 + minY/3] |= bit;
            
            if(dfs()) return true;
            
            A[minX][minY] = 0;
            originMark[minX][minY] = false;
            rowMask[minX] &= ~bit;
            colMask[minY] &= ~bit;
            boxMask[(minX/3)*3 + minY/3] &= ~bit;
        }
    }
    return false;
}
 
int main()
{
    while(true) {
        initialize();
        if(!input()) break;
        dfs();
    }
    return 0;
}
```