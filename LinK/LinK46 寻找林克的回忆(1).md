# LinK46 寻找林克的回忆(1)
[题目链接](http://xmuoj.com/contest/362/problem/LinK46)

## 题意概括

给定一个数独题，完成数独的填写。


## 思路

这题依旧使用[DFS](https://oi-wiki.org/search/dfs/) + 剪枝实现。我们实时记录并回溯每行每列每宫格数字的占用情况，一格一格进行枚举数字即可。

---

## 实现细节

用数组记录每行每列每宫格的数字占用情况，其中行与列较为简单，用 `bool[9][9]` 记录即可。其中第一个索引代表行/列的索引，第二个索引代表记录的是哪个数字的使用情况。

宫格稍微复杂，使用 `bool[3][3][9]` 记录，前两个索引代表宫格的位置，第三个索引代表记录的是哪个数字的使用情况。

---

## AC代码
```cpp
#include <iostream>
 
int A[9][9]; bool originMark[9][9]; //A是数独 originMark标记题目给出的初始数字
bool usedInRow[9][9],usedInColumn[9][9],usedInBox[3][3][9]; //分别记录每行每列每个数字的使用情况
 
bool input()
{
	std::string line;
	for(int i=0;i<9;++i)
	{
		std::cin>>line;
		if(line.length()!=9)return false;
		for(int j=0;j<9;++j)
		{
			A[i][j]=line[j]-'0';
			if(A[i][j]) { //如果不为0则需要修改数字占用情况
                originMark[i][j] = true;
                usedInRow[i][A[i][j]-1] = true;
                usedInColumn[j][A[i][j]-1] = true;
                usedInBox[i/3][j/3][A[i][j]-1] = true;
            }
		}
	}
	return true;
}
 
void output() //输出
{
	for(int i=0;i<9;++i)
	{
		for(int j=0;j<9;++j)
			putchar(A[i][j]+'0');
		putchar('\n');
	}
}
 
bool dfs(int n) //n是枚举的格子的编号，n=9*x+y，也可以理解为九进制状态掩码
{
	if(n==81)
	{
		output();
		return true;
	}
	int x,y;
	bool res=false;
	x=n/9,y=n%9; //解析状态掩码
	if(originMark[x][y]) // 对于题目给定了的初始数字，直接跳过
	{
		return dfs(n+1);
	}
	for(int num=1;num<=9;++num)
	{
		if(!usedInRow[x][num-1] && !usedInColumn[y][num-1] && !usedInBox[x/3][y/3][num-1])
		{
			A[x][y]=num,usedInRow[x][num-1]=true,usedInColumn[y][num-1]=true,usedInBox[x/3][y/3][num-1]=true; // 修改数字占用信息
			if(dfs(n+1))return true;
			A[x][y]=0,usedInRow[x][num-1]=false,usedInColumn[y][num-1]=false,usedInBox[x/3][y/3][num-1]=false; // 回溯
		}
	}
	return false;
}
 
int main()
{
	input();
	dfs(0);
	return 0;
}
```