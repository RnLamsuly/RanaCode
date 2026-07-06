# LinK49 寻找林克的回忆(4)
[题目链接](http://xmuoj.com/contest/362/problem/LinK49)

## 思路

仍然是使用**启发式搜索 + 位运算优化**，不过这里的掩码需要使用 `long long` ，否则会溢出。

此外我们还需要进一步的优化，每次填写数字前先检查数独中是否有已经唯一确定的格子，并将这些数字填入。DFS之后要记得回溯。

---

## AC代码
```cpp
#include <iostream>
#include <string>
#include <vector>
#include <cstring>
#include <algorithm>
using namespace std;
 
int A[16][16];
bool originMark[16][16];
long long rowMask[16], colMask[16], boxMask[16];
 
int getCandidates(int x, int y) {
    return ~(rowMask[x] | colMask[y] | boxMask[(x/4)*4 + y/4]) & 0xFFFF;
}
 
int countBits(int mask) {
    int count = 0;
    while(mask) {
        count++;
        mask &= (mask - 1);
    }
    return count;
}
 
void initialize()
{
    for(int i = 0; i < 16; ++i) {
        for(int j = 0; j < 16; ++j) {
            A[i][j] = 0;
            originMark[i][j] = false;
        }
        rowMask[i] = 0;
        colMask[i] = 0;
        boxMask[i] = 0;
    }
}
 
bool input()
{
    string line;
    for(int i = 0; i < 16; ++i) {
    	cin >> line;
        for(int j = 0; j < 16; ++j) {
            if(line[j] != '-') {
                int num = line[j] - 'A' + 1;
                A[i][j] = num;
                originMark[i][j] = true;
                int bit = 1 << (num - 1);
                rowMask[i] |= bit;
                colMask[j] |= bit;
                boxMask[(i/4)*4 + j/4] |= bit;
            }
        }
    }
    return true;
}
 
void output()
{
    for(int i = 0; i < 16; ++i) {
        for(int j = 0; j < 16; ++j) {
            cout << (char)(A[i][j] + 'A' - 1);
        }
    cout << endl;
    }
}
 
bool constrainPropagation() { // 处理已经唯一确定的格子
    bool changed = true;
    while (changed) {
        changed = false;
        
        // 先检查唯一确定的格子
        // 填写完这些格子之后可能会出现新的唯一确定的格子
        for (int i = 0; i < 16; ++i) {
            for (int j = 0; j < 16; ++j) {
                if (!originMark[i][j] && A[i][j] == 0) {
                    int cand = getCandidates(i, j);
                    int cnt = countBits(cand);
                    if (cnt == 0) return false; //出现无解的格子
                    if (cnt == 1) { //唯一确定的格子，直接填写
                        int num = __builtin_ctz(cand) + 1;
                        int bit = 1 << (num - 1);
                        A[i][j] = num; // 填写数字
                        rowMask[i] |= bit; // 修改掩码信息
                        colMask[j] |= bit;
                        boxMask[(i/4)*4 + j/4] |= bit;
                        changed = true;
                    }
                }
            }
        }
 
        //检查行
        for (int r = 0; r < 16; ++r) {
            int maskCount[16] = {0}, maskCol[16] = {0};
            for (int c = 0; c < 16; ++c) {
                if (!originMark[r][c] && A[r][c] == 0) {
                    int cand = getCandidates(r, c);
                    int m = cand;
                    while (m) {
                        int bit = m & -m;
                        int idx = __builtin_ctz(bit);
                        maskCount[idx]++;
                        maskCol[idx] = c;
                        m -= bit;
                    }
                }
            }
            for (int k = 0; k < 16; ++k) {
                if (maskCount[k] == 1) {
                    int c = maskCol[k];
                    if (!originMark[r][c] && A[r][c] == 0) {
                        int bit = 1 << k;
                        A[r][c] = k + 1;
                        rowMask[r] |= bit;
                        colMask[c] |= bit;
                        boxMask[(r/4)*4 + c/4] |= bit;
                        changed = true;
                    }
                }
            }
        }
 
        //检查列
        for (int c = 0; c < 16; ++c) {
            int maskCount[16] = {0}, maskRow[16] = {0};
            for (int r = 0; r < 16; ++r) {
                if (!originMark[r][c] && A[r][c] == 0) {
                    int cand = getCandidates(r, c);
                    int m = cand;
                    while (m) {
                        int bit = m & -m;
                        int idx = __builtin_ctz(bit);
                        maskCount[idx]++;
                        maskRow[idx] = r;
                        m -= bit;
                    }
                }
            }
            for (int k = 0; k < 16; ++k) {
                if (maskCount[k] == 1) {
                    int r = maskRow[k];
                    if (!originMark[r][c] && A[r][c] == 0) {
                        int bit = 1 << k;
                        A[r][c] = k + 1;
                        rowMask[r] |= bit;
                        colMask[c] |= bit;
                        boxMask[(r/4)*4 + c/4] |= bit;
                        changed = true;
                    }
                }
            }
        }
 
        // 检查宫格
        for (int b = 0; b < 16; ++b) {
            int rStart = (b / 4) * 4, cStart = (b % 4) * 4;
            int maskCount[16] = {0}, maskRow[16] = {0}, maskCol[16] = {0};
            for (int r = rStart; r < rStart + 4; ++r) {
                for (int c = cStart; c < cStart + 4; ++c) {
                    if (!originMark[r][c] && A[r][c] == 0) {
                        int cand = getCandidates(r, c);
                        int m = cand;
                        while (m) {
                            int bit = m & -m;
                            int idx = __builtin_ctz(bit);
                            maskCount[idx]++;
                            maskRow[idx] = r;
                            maskCol[idx] = c;
                            m -= bit;
                        }
                    }
                }
            }
            for (int k = 0; k < 16; ++k) {
                if (maskCount[k] == 1) {
                    int r = maskRow[k], c = maskCol[k];
                    if (!originMark[r][c] && A[r][c] == 0) {
                        int bit = 1 << k;
                        A[r][c] = k + 1;
                        rowMask[r] |= bit;
                        colMask[c] |= bit;
                        boxMask[(r/4)*4 + c/4] |= bit;
                        changed = true;
                    }
                }
            }
        }
    }
    return true;
}
 
bool dfs()
{
    if (!constrainPropagation()) return false;
    
    int minX = -1, minY = -1, minCandidates = 17;
    int candidates = 0;
    for(int i = 0; i < 16; ++i) {
        for(int j = 0; j < 16; ++j) {
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
    
    if(minX == -1) {
        output();
        return true;
    }
    
    for(int num = 1; num <= 16; ++num) {
        int bit = 1 << (num - 1);
        if(candidates & bit) {
            
            int backupA[16][16];
            long long backupRow[16], backupCol[16], backupBox[16];
            // 修改掩码前先备份掩码，用于回溯
            memcpy(backupA, A, sizeof(A));
            memcpy(backupRow, rowMask, sizeof(rowMask));
            memcpy(backupCol, colMask, sizeof(colMask));
            memcpy(backupBox, boxMask, sizeof(boxMask));
            
            A[minX][minY] = num;
            originMark[minX][minY] = true; 
            rowMask[minX] |= bit;
            colMask[minY] |= bit;
            boxMask[(minX/4)*4 + minY/4] |= bit;
            
            if(dfs()) return true;
            
            //回溯
            memcpy(A, backupA, sizeof(A));
            memcpy(rowMask, backupRow, sizeof(rowMask));
            memcpy(colMask, backupCol, sizeof(colMask));
            memcpy(boxMask, backupBox, sizeof(boxMask));
            originMark[minX][minY] = false;
        }
    }
    return false;
}
 
int main()
{
    initialize();
    input();
    dfs();
    return 0;
}
```