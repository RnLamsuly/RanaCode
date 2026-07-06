# LinK40 骑士林克的怜悯(1)
[题目链接](http://xmuoj.com/contest/362/problem/LinK40)

## 思路

本题依旧使用[DFS](https://oi-wiki.org/search/dfs/)来查询路径。由于我们要查找字典序最小的路径，所以我们一定是从A1格出发。

---

## 实现细节

我们用一个数组来记录所有可以走的方向，这样可以使代码简洁。
```cpp
int dir[8][2] = {{-2,-1}, {-2,1}, {-1,-2}, 
{-1,2}, {1,-2}, {1,2}, {2,-1}, {2,1}};
```

数组中的8个方向的排列顺序**不可改变**，这是因为因为要保证字典序最小，所以我们首先要保证**列坐标优先减少**，其次要保证**行坐标尽可能减小**。

---

## AC代码
```cpp
#include <iostream>
#include <string.h>
#include <queue>
using std::queue;
using std::string;
 
int n,m;
bool flag[30][30];
int ans[1000][2];
int dir[8][2] = {{-2,-1}, {-2,1}, {-1,-2}, {-1,2}, {1,-2}, {1,2}, {2,-1}, {2,1}};
 
void initialize() //初始化标记数组
{
	for(int i=0;i<25;++i)
		for(int j=0;j<25;++j)
			flag[i][j]=false;
}
 
void output() //输出路径
{
	for(int i=0;i<n*m;++i)printf("%c%d",'A'+ans[i][0],1+ans[i][1]);
	putchar('\n');
}
 
bool dfs(int x,int y,int step)
{
	ans[step][0]=x,ans[step][1]=y;
	flag[x][y]=true;
	if(step == m*n-1) //路径长度达到最大
	{
		output();
		return true;
	}
	for(int i=0;i<8;++i) //枚举八个方向
	{
		int dx=dir[i][0],dy=dir[i][1];
		if(x+dx<n && x+dx>=0 && y+dy<m && y+dy>=0 && !flag[x+dx][y+dy])
			if(dfs(x+dx,y+dy,step+1))return true;
	}
	flag[x][y]=false;
	return false;
}
 
int main()
{
	int t;
	scanf("%d",&t);
	for(int i=1;i<=t;++i)
	{
		initialize();
		scanf("%d%d",&m,&n);
		printf("#%d:\n",i);
		if(!dfs(0,0,0))printf("none\n");
	}
	return 0;
}
```