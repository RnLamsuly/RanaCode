# LinK45 真假记忆碎片
[题目链接](http://xmuoj.com/contest/362/problem/LinK45)

## 思路

判断分为两个部分：

- 判断是否篡改了原有数字。直接对比即可。
- 判断是否符合数独规则。逐行逐列逐宫格判断即可。

---

## AC代码
```cpp
#include <iostream>
#include <string.h>
 
int A[9][9] = 
{
    {5, 3, 0, 0, 7, 0, 0, 0, 0},
    {6, 0, 0, 1, 9, 5, 0, 0, 0},
    {0, 9, 8, 0, 0, 0, 0, 6, 0},
    {8, 0, 0, 0, 6, 0, 0, 0, 3},
    {4, 0, 0, 8, 0, 3, 0, 0, 1},
    {7, 0, 0, 0, 2, 0, 0, 0, 6},
    {0, 6, 0, 0, 0, 0, 2, 8, 0},
    {0, 0, 0, 4, 1, 9, 0, 0, 5},
    {0, 0, 0, 0, 8, 0, 0, 7, 9}
};
 
int B[9][9];
 
bool input() //输入时顺便检查是否篡改
{
	std::string line;
	for(int i=0;i<9;++i)
	{
		std::cin>>line;
		if(line.length()!=9)return false;
		for(int j=0;j<9;++j)
		{
			if(line[j]<'1' || line[j]>'9')return false;
			B[i][j]=line[j]-'0';
			if(A[i][j] && B[i][j]!=A[i][j])return false;
		}
	}
	return true;
}
 
bool checkRowAndColumn() //检查行列
{
	for(int i=0;i<9;++i)
	{
		bool rowUsed[9]={false},columnUsed[9]={false}; //用来记录每个数字是否已经使用过
		for(int j=0;j<9;++j)
		{
			if(rowUsed[B[i][j]-1])return false;
			rowUsed[B[i][j]-1]=true;
			if(columnUsed[B[j][i]-1])return false;
			columnUsed[B[j][i]-1]=true;
		}
	}
	return true;
}
 
bool checkBox() //检查宫格
{
	for(int x=0;x<3;++x)
	{
		for(int y=0;y<3;++y)
		{	
			int cx=3*x+1,cy=3*y+1;
			bool boxUsed[9]={false};//用来记录每个数字是否已经使用过
			for(int dx=-1;dx<=1;++dx)
			{
				for(int dy=-1;dy<=1;++dy)
				{
					if(boxUsed[B[cx+dx][cy+dy]-1])return false;
					boxUsed[B[cx+dx][cy+dy]-1]=true;
				}
			}
		}
	}
	return true;
}
 
int main()
{
	if(input() && checkRowAndColumn() && checkBox()) printf("Yes");
	else printf("No");
	return 0;
}
```