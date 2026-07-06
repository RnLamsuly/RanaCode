# LinK48 寻找林克的回忆(3)
[题目链接](http://xmuoj.com/contest/362/problem/LinK48)

## 思路

我们只需要加一个计分函数，每次填空结束后记录目前最高分即可。

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
int ans=-1;
 
int getCandidates(int x, int y) {
    return ~(rowMask[x] | colMask[y] | boxMask[(x/3)*3 + y/3]) & 0x1FF;
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
 
bool input()
{
    for(int i = 0; i < 9; ++i) {
        for(int j = 0; j < 9; ++j) {
        	scanf("%d",&A[i][j]);
            if(A[i][j]) {
                originMark[i][j] = true;
                int bit = 1 << (A[i][j] - 1);
                rowMask[i] |= bit;
                colMask[j] |= bit;
                boxMask[(i/3)*3 + j/3] |= bit;
            }
        }
    }
    return true;
}
 
void updateAns() //计算并更新答案
{
	int score=0;
	for(int i=0;i<9;++i)
		for(int j=0;j<9;++j)
			score+=(10-std::max(abs(i-4),abs(j-4)))*A[i][j];
	ans=std::max(score,ans);
}
 
void dfs()
{
    int minX = -1, minY = -1, minCandidates = 10;
    int candidates = 0;
    
    for(int i = 0; i < 9; ++i) {
        for(int j = 0; j < 9; ++j) {
            if(!originMark[i][j] && A[i][j] == 0) {
                int cand = getCandidates(i, j);
                int count = countBits(cand);
                if(count == 0) return;
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
        updateAns();
        return;
    }
    
    for(int num = 1; num <= 9; ++num) {
        int bit = 1 << (num - 1);
        if(candidates & bit) {
            A[minX][minY] = num;
            originMark[minX][minY] = true;
            rowMask[minX] |= bit;
            colMask[minY] |= bit;
            boxMask[(minX/3)*3 + minY/3] |= bit;
            
            dfs();
            
            A[minX][minY] = 0;
            originMark[minX][minY] = false;
            rowMask[minX] &= ~bit;
            colMask[minY] &= ~bit;
            boxMask[(minX/3)*3 + minY/3] &= ~bit;
        }
    }
    return;
}
 
int main()
{
	input();
	dfs();
	printf("%d",ans);
	return 0;
}
```