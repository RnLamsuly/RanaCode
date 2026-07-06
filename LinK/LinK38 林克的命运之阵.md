# LinK38 林克的命运之阵
[题目链接](http://xmuoj.com/contest/362/problem/LinK38)

## 思路

本题考查[DFS](https://oi-wiki.org/search/dfs/)(深度优先搜索)。搜索所有能走的路径，统计路径总数即可。

---

## 实现细节

题目要求格子不能重复走，所以我们需要一个二维布尔数组记录格子是否走过，每次走完需要回溯该数组。

---

## AC代码
```cpp
#include <iostream>
 
bool flag[30][50];
 
int dfs(int x,int y,int step) //直接将路径数量作为返回值
{
	if(step==0)return 1; //走到头代表一条路径
	int ans=0;
	flag[x][y]=true;
	if(!flag[x+1][y])ans+=dfs(x+1,y,step-1); //注意先判断坐标以防索引出界
	if(!flag[x][y-1])ans+=dfs(x,y-1,step-1);
	if(!flag[x][y+1])ans+=dfs(x,y+1,step-1);
	flag[x][y]=false; //回溯
	return ans;
}
 
int main()
{
	int n;
	scanf("%d",&n);
	printf("%d",dfs(0,25,n));
	return 0;
}
```