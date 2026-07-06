# LinK39 净化迷雾森林
[题目链接](http://xmuoj.com/contest/362/problem/LinK39)

## 思路

这是一道典型的**连通块问题**，查找连通区间上的格子总数。

本题我们使用BFS(广度优先搜索)解决。

与[DFS](https://oi-wiki.org/search/dfs/)不同，BFS并不追求每次走一条路径到底部。

BFS通常先将初始状态记录下来，然后每次从记录的状态中选择一个，遍历能从其到达的状态并记录下来，之后把选择的状态给移除掉，并在记录的状态中选择下一个以重复上述步骤，直到记录的所有状态都被遍历。

通常用先进先出的数据结构——队列 `queue` 来记录待遍历的状态。

---

## 实现细节

我们用结构体定义坐标对象，并申明记录坐标的队列。

从起点出发，每次把相邻的点都计入队列，然后将当前位置标记为"走过"并把当前处理的点弹出队列，之后再从队列选出点重复上述步骤。直到队列为空，遍历结束。

---

## AC代码
```cpp
#include <iostream>
#include <string.h>
#include <queue>
using std::queue;
using std::string;
 
int w,h,sx,sy;
char mp[25][25];
bool flag[25][25];
 
struct Pos{ //坐标对象
	int x,y;
};
 
void initialize() //初始化，将地图全标记为墙
{
	for(int i=0;i<25;++i)
		for(int j=0;j<25;++j)
			mp[i][j]='#',flag[i][j]=false;
}
 
bool input() //读入
{
	scanf("%d%d",&w,&h);
	if(!w && !h)return false;
	char c;
	for(int i=0;i<h;++i)
	{
		scanf("%s",mp[i]);
		for(int j=0;j<w;++j)
			if(mp[i][j]=='@')sx=i,sy=j; //记录起点
	}
	return true;
}
 
int bfs()
{
	int ans=0;
	queue<Pos> pos;
	Pos curr;
	int x,y;
	curr.x = sx , curr.y = sy , flag[sx][sy]=true;
	pos.push(curr); //先将起点记录到队列中
	flag[curr.x][curr.y]=true;
	while(!pos.empty())
	{
        //取出队首的坐标并将这个坐标弹出队列
		curr=pos.front();
		pos.pop();
		ans++; //统计空格数+1
		x=curr.x;
		y=curr.y;
        //将四周没走过的空地全部加入队列
		if(x+1<h && !flag[x+1][y] && mp[x+1][y]=='.'){curr.x=x+1,curr.y=y;flag[curr.x][curr.y]=true;pos.push(curr);}
		if(x-1>=0 && !flag[x-1][y] && mp[x-1][y]=='.'){curr.x=x-1,curr.y=y;flag[curr.x][curr.y]=true;pos.push(curr);}
		if(y+1<w && !flag[x][y+1] && mp[x][y+1]=='.'){curr.x=x,curr.y=y+1;flag[curr.x][curr.y]=true;pos.push(curr);}
		if(y-1>=0 && !flag[x][y-1] && mp[x][y-1]=='.'){curr.x=x,curr.y=y-1;flag[curr.x][curr.y]=true;pos.push(curr);}
	}
	return ans;
}
 
int main()
{
	initialize();
	while(input())
	{
		printf("%d\n",bfs());
		initialize();
	}
	return 0;
}
```

---

## 补充

连通块问题并非只有一种解法。你也可以尝试使用：

- [DFS](https://oi-wiki.org/search/dfs/)
- 二维[并查集](https://oi-wiki.org/ds/dsu/)