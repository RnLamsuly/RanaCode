# LinK11 DFS试炼之排列数字
[题目链接](http://xmuoj.com/contest/362/problem/LinK11)

## 思路

这是一道DFS回溯的经典例题。

DFS（Depth-First Search），即深度优先搜索，是一种基于深度优先遍历的搜索算法，即通过递归，对每个状态的子状态进行遍历，直到寻找到目标状态。我们将已确定前 $n$ 个数的序列视为一种状态，通过枚举下一个数来得到其子状态，并进行遍历。

而回溯，指的是当遍历时会对原有的状态产生影响时，我们先改变原有状态，然后调用递归，最后消除改变的过程。这里我们需要使用状态数组存储某个数是否被使用过，便需要用到回溯。

---

## AC 代码
```cpp
#include <iostream>
#include <string.h>
using std::string;
using std::cin;
using std::cout;
using std::endl; 
int n,flag[15],get[15]; //flag用以记录数字是否选取，get用以记录已选取组成的数列
inline void output()
{
	for(register int i=0;i<n;i++)	printf("%d ",get[i]);
	cout<<endl;
    return;	
} 
inline void dfs(int k) //这里的k表示前k个数已经确定，即待选的数索引为k
{
	if(k==n)
	{
		output();
		return;
	}
	for(register int i=1;i<=n;++i)
	{
		if(flag[i])continue; //数字不能重复使用
			
			flag[i]=1; //改变状态
			get[k]=i; //这里记录的是当前选取的第k+1个数的值
			dfs(k+1);
			flag[i]=0; //消除状态的改变，回溯
	}
}
int main()
{
	scanf("%d",&n);
	dfs(0); //索引从0开始
	return 0;	
}
```