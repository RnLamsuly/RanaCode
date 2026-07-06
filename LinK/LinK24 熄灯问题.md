# LinK24 熄灯问题
[题目链接](http://xmuoj.com/contest/362/problem/LinK24)

## 思路

本题是 [LinK23](http://xmuoj.com/contest/362/problem/LinK23) 的二维版本。

我们将枚举第一个点改为枚举第一列中的所有情况，然后逐行递推，最终判断灯是否全部熄灭即可。

---

## 处理细节

1. 我们选择枚举第一列，而不是枚举第一行。这是因为第一列只有 $5$ 盏灯，而第一行有 $6$ 盏灯。尽管对 $6$ 盏灯枚举远不会超时，但枚举 $5$ 盏灯还是更优。
2. 我们选择用**状态压缩**来枚举第一列的情况以**简化代码**。*(LinK19 的题解中我们已经介绍过状态压缩，这里不再赘述)*

---

## AC代码
```cpp
#include <iostream>
using namespace std;
bool puzzle[5][6],puzzleCopy[5][6]; //puzzle存储灯的初始状态，puzzleCopy在测试每种情况前拷贝puzzle
bool ans[5][6]; //用于储存答案，True代表某个按钮需要按下
int t=0; //当前测试数据的组数
 
void output() //得到答案后输出答案
{
	printf("PUZZLE #%d\n",t);
	for(int i=0;i<5;++i)
	{
		for(int j=0;j<6;++j)
			printf("%d ",ans[i][j]);
		printf("\n");
	}
}
 
void input() //读入灯的初始情况
{
	for(int i=0;i<5;++i)
		for(int j=0;j<6;++j)
			scanf("%d",&puzzle[i][j]);
}
 
void initializeAns() //每次处理新一组数据时，将答案数组初始化
{
	for(int i=0;i<5;++i)
		for(int j=0;j<6;++j)
			ans[i][j]=0; 
}
 
void copyPuzzle() //用于将puzzle复制给puzzleCopy
{
	for(int i=0;i<5;++i)
		for(int j=0;j<6;++j)
			puzzleCopy[i][j]=puzzle[i][j];
}
 
void executeInCopy(int x,int y) //用于在puzzleCopy中执行按下按钮的操作
{
	ans[x][y]=1;
	puzzleCopy[x][y]=!puzzleCopy[x][y];
	if(x>0)puzzleCopy[x-1][y]=!puzzleCopy[x-1][y];
	if(x<4)puzzleCopy[x+1][y]=!puzzleCopy[x+1][y];
	if(y>0)puzzleCopy[x][y-1]=!puzzleCopy[x][y-1];
	if(y<5)puzzleCopy[x][y+1]=!puzzleCopy[x][y+1];
}
 
bool check() //用于检查puzzleCopy中的灯是否全部熄灭
{
	for(int i=0;i<5;++i)
		for(int j=0;j<6;++j)
			if(puzzleCopy[i][j])return 0;
	return 1;
}
 
void solve() //求解函数，用在枚举完第一列后递推剩下的灯
{
	for(int j=0;j<5;++j)
	{
		for(int i=0;i<5;++i)
		{
			if(puzzleCopy[i][j])
			{
				executeInCopy(i,j+1);
			}
		}
	}
}
 
void enu() //用于枚举第一列的情况
{
	for(int mask=0;mask<32;++mask) //状态掩码作为循环变量。五盏灯共32种情况，故从0枚举到31
	{
		initializeAns();
		copyPuzzle();
		for(int i=0;i<5;++i)
		{
			if(mask&(1<<i)) //根据状态掩码进行第一列中的按钮操作
			{
				executeInCopy(i,0);
			}
		}
		solve();
		if(check())
		{
			output();
			return;
		}
	}
}
 
int main()
{
	int n;
	scanf("%d",&n);
	for(t=1;t<=n;++t)
	{
		input();
		enu();
	}
	return 0;
}
```